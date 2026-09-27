import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetHeaderComponent } from './asset-header.component';
import { AssetDetailsComponent } from './asset-details.component';
import { PerformanceAnalyticsComponent } from './performance-analytics.component';
import { TransactionHistoryComponent } from './transaction-history.component';

@Component({
  selector: 'app-collectible-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AssetHeaderComponent,
    AssetDetailsComponent,
    PerformanceAnalyticsComponent,
    TransactionHistoryComponent
  ],
  templateUrl: './collectible-dashboard.component.html',
  styleUrls: ['./collectible-dashboard.component.scss']
})
export class CollectibleDashboardComponent {}
