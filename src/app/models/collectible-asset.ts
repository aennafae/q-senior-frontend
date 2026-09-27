export interface CollectibleAsset {
  id: string;
  name: string;
  year: number;
  model: string;
  vin: string;
  currentEstimatedValue: number;
  currency: string;
  acquisitionDate: Date;
  acquisitionCost: number;
  condition: 'Pristine' | 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Restored';
  mileage: number;
  color: string;
  interior: string;
  engine: string;
  horsepower: number;
  provenance: string[];
  images: string[];
}

export interface ValueHistory {
  date: Date;
  estimatedValue: number;
}

export interface Transaction {
  id: string;
  date: Date;
  eventType: 'Sale' | 'Auction' | 'Appraisal';
  price: number;
  location: string;
  notes: string;
}

export interface PerformanceMetrics {
  totalAppreciation: number;
  totalAppreciationPercentage: number;
  annualROI: number;
  peakValue: number;
  peakValueDate: Date;
}
