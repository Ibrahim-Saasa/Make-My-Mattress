
import { ShippingCarrier } from '../types';

/**
 * PHASE 3: OPERATION EMPIRE - LOGISTICS DECISION ENGINE
 */

const DENSITY_FACTOR = 0.025; 
const VOLUMETRIC_DIVISOR = 5000;

export const assignShippingCarrier = (
  l: number, 
  b: number, 
  h: number, 
  distanceKm: number
): ShippingCarrier => {
  const volume = l * b * h;
  const actualWeight = volume * DENSITY_FACTOR;
  const volumetricWeight = volume / VOLUMETRIC_DIVISOR;
  const finalWeight = Math.max(actualWeight, volumetricWeight);

  // 1. Hyperlocal Logic (<20km) -> Dealer Fleet
  if (distanceKm < 20) {
    return ShippingCarrier.DEALER_FLEET;
  }

  // 2. Small Packet Logic (<5kg) -> Air Courier
  if (finalWeight < 5) {
    return ShippingCarrier.AIR_COURIER;
  }

  // 3. Heavy Freight Logic (>5kg) -> Surface Cargo
  return ShippingCarrier.SURFACE_CARGO;
};

export const calculateLogistics = (l: number, b: number, h: number) => {
  const volume = l * b * h;
  const weight_kg = Math.round(volume * DENSITY_FACTOR);
  const is_cargo = weight_kg > 30;

  return {
    weight_kg,
    is_cargo,
    shipping_method: is_cargo ? 'CARGO_TRUCK' : 'STANDARD_COURIER'
  };
};

export const fetchRelatedProducts = (l: number, b: number) => {
  let sizeLabel = 'Single';
  if (l >= 72 && b >= 60) sizeLabel = 'King';
  else if (l >= 72 && b >= 48) sizeLabel = 'Queen';

  return [
    { id: 'acc_1', name: `Waterproof ${sizeLabel} Protector`, category: 'PROTECTOR', price: 1800 },
    { id: 'acc_2', name: `Luxury ${sizeLabel} Fitted Sheet`, category: 'SHEET', price: 2400 }
  ];
};
