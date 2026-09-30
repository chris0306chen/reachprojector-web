import assert from "node:assert/strict";
import test from "node:test";
import { calculatePackageQuote, type ShippingRate } from "../src/lib/shipping-quote";

const parcel = { packedWeightKg: 1, lengthCm: 10, widthCm: 10, heightCm: 10, quantity: 1 };
// Synthetic values only; these are not commercial rates.
const rate: ShippingRate = {
  id: "test", name: "Test", method: "air", tradeTerms: "DDP", currency: "USD",
  minWeightKg: 0, maxWeightKg: 2, baseWeightKg: 1, baseFee: 10,
  incrementWeightKg: 0.5, incrementFee: 5, minimumFee: 0, volumetricDivisor: 6000,
};

test("weight boundaries, increments, volumetric weight and parcel quantity", () => {
  for (const [weight, cost] of [[1, 10], [1.01, 15], [1.5, 15], [2, 20]]) {
    assert.equal(calculatePackageQuote({ ...parcel, packedWeightKg: weight }, rate)?.shippingCost, cost);
  }
  assert.equal(calculatePackageQuote({ ...parcel, packedWeightKg: 2.01 }, rate), null);
  assert.equal(calculatePackageQuote(parcel, { ...rate, minWeightKg: 1.5 }), null);
  const quote = calculatePackageQuote({ ...parcel, lengthCm: 90, quantity: 2 }, rate);
  assert.equal(quote?.chargeableWeightPerPackageKg, 1.5);
  assert.equal(quote?.totalChargeableWeightKg, 3);
  assert.equal(quote?.shippingCost, 30);
});

test("missing, nonfinite and negative package data cannot yield a quote", () => {
  for (const field of ["packedWeightKg", "lengthCm", "widthCm", "heightCm", "quantity"]) {
    for (const value of [0, -1, NaN, Infinity, -Infinity]) {
      assert.equal(calculatePackageQuote({ ...parcel, [field]: value }, rate), null, `${field}=${value}`);
    }
  }
  assert.equal(calculatePackageQuote({ ...parcel, quantity: 1.5 }, rate), null);
  assert.equal(calculatePackageQuote({ ...parcel, quantity: Number.MAX_SAFE_INTEGER + 1 }, rate), null);
});

test("invalid rate numbers and zero or overflowing charges require manual quoting", () => {
  for (const field of ["minWeightKg", "maxWeightKg", "baseWeightKg", "baseFee", "incrementWeightKg", "incrementFee", "minimumFee", "volumetricDivisor"]) {
    for (const value of [-1, NaN, Infinity, -Infinity]) {
      assert.equal(calculatePackageQuote(parcel, { ...rate, [field]: value }), null, `${field}=${value}`);
    }
  }
  assert.equal(calculatePackageQuote(parcel, { ...rate, baseFee: 0 }), null);
  assert.equal(calculatePackageQuote(parcel, { ...rate, baseFee: 0.001 }), null);
  assert.equal(calculatePackageQuote({ ...parcel, quantity: 2 }, { ...rate, baseFee: Number.MAX_VALUE }), null);
  assert.equal(calculatePackageQuote(parcel, { ...rate, minWeightKg: 3 }), null);
  assert.equal(calculatePackageQuote(parcel, { ...rate, incrementWeightKg: 0 }), null);
  assert.equal(calculatePackageQuote(parcel, { ...rate, volumetricDivisor: 0 }), null);
  assert.equal(calculatePackageQuote({ ...parcel, lengthCm: Number.MAX_VALUE }, rate), null);
});

test("minimum fees and per-kilogram rates remain supported", () => {
  assert.equal(calculatePackageQuote(parcel, { ...rate, minimumFee: 25 })?.shippingCost, 25);
  assert.equal(calculatePackageQuote(parcel, { ...rate, baseFee: 0, baseWeightKg: 0 })?.shippingCost, 10);
});

test("decimal increments do not add an extra unit at an exact weight boundary", () => {
  const decimalRate = { ...rate, incrementWeightKg: 0.1 };
  assert.equal(calculatePackageQuote({ ...parcel, packedWeightKg: 1.1 }, decimalRate)?.shippingCost, 15);
  assert.equal(calculatePackageQuote({ ...parcel, packedWeightKg: 1.11 }, decimalRate)?.shippingCost, 20);
  assert.equal(calculatePackageQuote({ ...parcel, packedWeightKg: 1.2 }, { ...decimalRate, maxWeightKg: 1.2 })?.shippingCost, 20);
  assert.equal(calculatePackageQuote({ ...parcel, packedWeightKg: 1.201 }, { ...decimalRate, maxWeightKg: 1.2 }), null);
});
