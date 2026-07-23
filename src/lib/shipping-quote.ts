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

export function calculatePackageQuote(input: PackageInput, rate: ShippingRate) {
  if (
    input.packedWeightKg <= 0 ||
    input.lengthCm <= 0 ||
    input.widthCm <= 0 ||
    input.heightCm <= 0 ||
    input.quantity < 1 ||
    rate.volumetricDivisor <= 0 ||
    rate.incrementWeightKg <= 0
  ) {
    return null;
  }

  const volumetricWeightKg =
    (input.lengthCm * input.widthCm * input.heightCm) / rate.volumetricDivisor;
  const rawChargeableWeightKg = Math.max(input.packedWeightKg, volumetricWeightKg);
  const chargeableWeightPerPackageKg =
    Math.ceil(rawChargeableWeightKg / rate.incrementWeightKg) * rate.incrementWeightKg;

  if (
    chargeableWeightPerPackageKg < rate.minWeightKg ||
    chargeableWeightPerPackageKg > rate.maxWeightKg
  ) {
    return null;
  }

  const extraWeightKg = Math.max(0, chargeableWeightPerPackageKg - rate.baseWeightKg);
  const extraUnits = Math.ceil(extraWeightKg / rate.incrementWeightKg);
  const costPerPackage = Math.max(
    rate.minimumFee,
    rate.baseFee + extraUnits * rate.incrementFee
  );

  return {
    actualWeightPerPackageKg: input.packedWeightKg,
    volumetricWeightPerPackageKg: Number(volumetricWeightKg.toFixed(2)),
    chargeableWeightPerPackageKg: Number(chargeableWeightPerPackageKg.toFixed(2)),
    totalChargeableWeightKg: Number((chargeableWeightPerPackageKg * input.quantity).toFixed(2)),
    shippingCost: Number((costPerPackage * input.quantity).toFixed(2)),
  };
}
