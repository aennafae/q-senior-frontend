import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartOptions, registerables } from 'chart.js';
import { CollectibleAssetService } from '../../../services/collectible-asset.service';
import { ValueHistory, PerformanceMetrics } from '../../../models/collectible-asset';

Chart.register(...registerables);

@Component({
  selector: 'app-performance-analytics',
  standalone: true,
  imports: [CommonModule, MatIconModule, BaseChartDirective],
  templateUrl: './performance-analytics.component.html',
  styleUrls: ['./performance-analytics.component.scss']
})
export class PerformanceAnalyticsComponent implements OnInit {
  valueHistory: ValueHistory[] = [];
  metrics: PerformanceMetrics | null = null;
  chartConfig: ChartConfiguration<'line'> | null = null;

  constructor(private assetService: CollectibleAssetService) {}

  ngOnInit() {
    this.valueHistory = this.assetService.getValueHistory();
    this.metrics = this.assetService.getPerformanceMetrics();
    this.initializeChart();
  }

  private initializeChart() {
    const labels = this.valueHistory.map(v => this.formatDate(v.date));
    const data = this.valueHistory.map(v => v.estimatedValue);

    const options: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: true,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            color: '#e8e8e8',
            font: { size: 14, weight: 'bold' },
            padding: 15,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 20, 25, 0.95)',
          titleColor: '#d4af37',
          bodyColor: '#e8e8e8',
          borderColor: '#d4af37',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            label: (context) => {
              const value = context.parsed.y;
              return `USD $${(value as number).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: 'rgba(42, 47, 62, 0.3)',
            display: true
          },
          ticks: {
            color: '#a0a0a0',
            font: { size: 12 },
            callback: (value) => {
              return '$' + ((value as number) / 1_000_000).toFixed(1) + 'M';
            }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#a0a0a0',
            font: { size: 12 }
          }
        }
      }
    };

    this.chartConfig = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Estimated Value',
            data,
            borderColor: '#d4af37',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointBackgroundColor: '#d4af37',
            pointBorderColor: '#0f1419',
            pointBorderWidth: 2,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: '#ffd700'
          }
        ]
      },
      options
    };
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: '2-digit', month: 'short' });
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
