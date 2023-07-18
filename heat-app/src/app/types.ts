interface HomeData {
  name: string;
  weatherStation: string;
  tempOverride: number | null;
  livingArea: number;
  fuelType: 'gas' | 'oil' | 'propane';
  heatSystemEfficiency: number;
  thermostatSetPoint: number;
  setbackTemp: number;
  setbackHours: number;
  balancePoint: number;
  balanceSensitivity: number;
}

export type { HomeData };
