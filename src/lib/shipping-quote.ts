export interface PackageInput {
  packedWeightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  quantity: number;
}

export interface ShippingRate {
  id: string;
  name: string;
  method: string;
  tradeTerms: "DDP" | "DAP";
  currency: string;
  minWeightKg: number;
  maxWeightKg: number;
  baseWeightKg: number;
  baseFee: number;
  incrementWeightKg: number;
  incrementFee: number;
  minimumFee: number;
  volumetricDivisor: number;
  estimatedDaysMin?: number | null;
  estimatedDaysMax?: number | null;
}

function weightUnits(weightKg: number, incrementKg: number) {
  // Remove binary floating-point noise before rounding up decimal weight steps.
  return Math.ceil(Number((weightKg / incrementKg).toPrecision(15)));
}

export function calculatePackageQuote(input: PackageInput, rate: ShippingRate) {
  if (
    ![input.packedWeightKg, input.lengthCm, input.widthCm, input.heightCm, input.quantity]
      .every((value) => Number.isFinite(value) && value > 0) ||
    !Number.isSafeInteger(input.quantity) ||
    ![rate.minWeightKg, rate.maxWeightKg, rate.baseWeightKg, rate.baseFee,
      rate.incrementWeightKg, rate.incrementFee, rate.minimumFee, rate.volumetricDivisor]
      .every((value) => Number.isFinite(value) && value >= 0) ||
    rate.maxWeightKg < rate.minWeightKg ||
    rate.volumetricDivisor <= 0 ||
    rate.incrementWeightKg <= 0
  ) {
    return null;
  }

  const volumetricWeightKg =
    (input.lengthCm * input.widthCm * input.heightCm) / rate.volumetricDivisor;
  const rawChargeableWeightKg = Math.max(input.packedWeightKg, volumetricWeightKg);
  const chargeableWeightPerPackageKg =
    Number((weightUnits(rawChargeableWeightKg, rate.incrementWeightKg) * rate.incrementWeightKg).toPrecision(15));

  if (
    chargeableWeightPerPackageKg < rate.minWeightKg ||
    chargeableWeightPerPackageKg > rate.maxWeightKg
  ) {
    return null;
  }

  const extraWeightKg = Math.max(0, chargeableWeightPerPackageKg - rate.baseWeightKg);
  const extraUnits = weightUnits(extraWeightKg, rate.incrementWeightKg);
  const costPerPackage = Math.max(
    rate.minimumFee,
    rate.baseFee + extraUnits * rate.incrementFee
  );
  const shippingCost = Number((costPerPackage * input.quantity).toFixed(2));
  const totalChargeableWeightKg = chargeableWeightPerPackageKg * input.quantity;
  if (
    !Number.isFinite(totalChargeableWeightKg) ||
    !Number.isSafeInteger(Math.round(shippingCost * 100)) ||
    shippingCost <= 0
  ) {
    return null;
  }

  return {
    actualWeightPerPackageKg: input.packedWeightKg,
    volumetricWeightPerPackageKg: Number(volumetricWeightKg.toFixed(2)),
    chargeableWeightPerPackageKg: Number(chargeableWeightPerPackageKg.toFixed(2)),
    totalChargeableWeightKg: Number(totalChargeableWeightKg.toFixed(2)),
    shippingCost,
  };
}
