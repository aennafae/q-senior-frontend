import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CollectibleAssetService } from '../../../services/collectible-asset.service';
import { Transaction } from '../../../models/collectible-asset';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss']
})
export class TransactionHistoryComponent implements OnInit {
  transactions: Transaction[] = [];
  defaultDate = new Date();

  constructor(private assetService: CollectibleAssetService) {}

  ngOnInit() {
    this.transactions = this.assetService.getTransactions();
  }

  getEventIcon(eventType: string): string {
    switch (eventType) {
      case 'Sale':
        return 'attach_money';
      case 'Auction':
        return 'gavel';
      case 'Appraisal':
        return 'assessment';
      default:
        return 'info';
    }
  }

  getEventColor(eventType: string): string {
    switch (eventType) {
      case 'Sale':
        return 'sale';
      case 'Auction':
        return 'auction';
      case 'Appraisal':
        return 'appraisal';
      default:
        return '';
    }
  }

  formatDate(date?: Date): string {
    const d = new Date(date || this.defaultDate);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }
}
