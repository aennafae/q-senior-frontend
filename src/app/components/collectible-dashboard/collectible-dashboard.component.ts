import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TransactionHistoryComponent} from './transaction-history/transaction-history.component';
import {AssetDetailsComponent} from './asset-details/asset-details.component';
import {PerformanceAnalyticsComponent} from './performance-analytics/performance-analytics.component';
import {AssetHeaderComponent} from './asset-header/asset-header.component';
import {QuickNavComponent} from './quick-nav/quick-nav.component';

@Component({
  selector: 'app-collectible-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AssetHeaderComponent,
    QuickNavComponent,
    AssetDetailsComponent,
    PerformanceAnalyticsComponent,
    TransactionHistoryComponent,
    TransactionHistoryComponent,
    AssetDetailsComponent,
    PerformanceAnalyticsComponent,
    AssetHeaderComponent
  ],
  templateUrl: './collectible-dashboard.component.html',
  styleUrls: ['./collectible-dashboard.component.scss']
})
export class CollectibleDashboardComponent {}
