import { Injectable } from '@angular/core';
import { CollectibleAsset, ValueHistory, Transaction, PerformanceMetrics } from '../models/collectible-asset';

@Injectable({
  providedIn: 'root'
})
export class CollectibleAssetService {
  private mockAsset: CollectibleAsset = {
    id: 'aston-martin-db5-001',
    name: '1964 Aston Martin DB5',
    year: 1964,
    model: 'DB5',
    vin: 'DB5/2018/1',
    currentEstimatedValue: 4_850_000,
    currency: 'USD',
    acquisitionDate: new Date('2010-06-15'),
    acquisitionCost: 1_200_000,
    condition: 'Pristine',
    mileage: 8_742,
    color: 'Silver Birch',
    interior: 'Black Leather with Trim',
    engine: 'Inline 6-cylinder, Twin overhead cams',
    horsepower: 282,
    provenance: [
      'Originally delivered to a prominent British industrialist',
      'Showcased at the Concours d\'Elegance in 1998',
      'Featured in multiple automotive publications',
      'Recently certified authentic by Aston Martin Heritage Trust'
    ],
    images: [
      '/aston-martin-db5/1965-Aston-Martin-DB5-Vantage_2.webp',
      '/aston-martin-db5/dave-robinson-SrhczLwIMV0-unsplash.jpg',
      '/aston-martin-db5/dave-robinson-okSrkTRalds-unsplash.jpg'
    ]
  };

  private valueHistory: ValueHistory[] = [
    { date: new Date('2010-06-15'), estimatedValue: 1_200_000 },
    { date: new Date('2011-12-31'), estimatedValue: 1_400_000 },
    { date: new Date('2013-06-30'), estimatedValue: 1_650_000 },
    { date: new Date('2014-12-31'), estimatedValue: 1_900_000 },
    { date: new Date('2016-06-15'), estimatedValue: 2_250_000 },
    { date: new Date('2017-12-31'), estimatedValue: 2_750_000 },
    { date: new Date('2019-06-30'), estimatedValue: 3_150_000 },
    { date: new Date('2020-12-31'), estimatedValue: 3_400_000 },
    { date: new Date('2022-06-15'), estimatedValue: 4_100_000 },
    { date: new Date('2023-12-31'), estimatedValue: 4_500_000 },
    { date: new Date('2024-06-30'), estimatedValue: 4_650_000 },
    { date: new Date('2025-12-31'), estimatedValue: 4_850_000 }
  ];

  private transactions: Transaction[] = [
    {
      id: 'txn-001',
      date: new Date('2025-10-15'),
      eventType: 'Appraisal',
      price: 4_850_000,
      location: 'Bonhams Automotive Specialists, London',
      notes: 'Annual valuation - Pristine condition maintained'
    },
    {
      id: 'txn-002',
      date: new Date('2024-06-22'),
      eventType: 'Appraisal',
      price: 4_650_000,
      location: 'RM Sotheby\'s, New York',
      notes: 'Comprehensive condition assessment'
    },
    {
      id: 'txn-003',
      date: new Date('2023-11-08'),
      eventType: 'Auction',
      price: 4_500_000,
      location: 'Gooding & Company, Scottsdale',
      notes: 'Sold to private collector. Extensive restoration completed 2 years prior.'
    },
    {
      id: 'txn-004',
      date: new Date('2022-04-10'),
      eventType: 'Appraisal',
      price: 4_100_000,
      location: 'Christie\'s, Los Angeles',
      notes: 'Pre-restoration valuation'
    },
    {
      id: 'txn-005',
      date: new Date('2020-02-14'),
      eventType: 'Appraisal',
      price: 3_400_000,
      location: 'Bringatrailer.com Collector Network',
      notes: 'Standard annual appraisal'
    }
  ];

  getAsset(): CollectibleAsset {
    return this.mockAsset;
  }

  getValueHistory(): ValueHistory[] {
    return this.valueHistory;
  }

  getTransactions(): Transaction[] {
    return this.transactions;
  }

  getPerformanceMetrics(): PerformanceMetrics {
    const acquisition = this.valueHistory[0].estimatedValue;
    const current = this.valueHistory[this.valueHistory.length - 1].estimatedValue;
    const totalAppreciation = current - acquisition;
    const totalAppreciationPercentage = (totalAppreciation / acquisition) * 100;

    const yearsSinceAcquisition =
      (this.valueHistory[this.valueHistory.length - 1].date.getTime() -
       this.valueHistory[0].date.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

    const annualROI = (Math.pow(current / acquisition, 1 / yearsSinceAcquisition) - 1) * 100;

    const peakValueEntry = this.valueHistory.reduce((prev, current) =>
      current.estimatedValue > prev.estimatedValue ? current : prev
    );

    return {
      totalAppreciation,
      totalAppreciationPercentage,
      annualROI,
      peakValue: peakValueEntry.estimatedValue,
      peakValueDate: peakValueEntry.date
    };
  }
}
