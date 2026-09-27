import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CollectibleAssetService } from '../../services/collectible-asset.service';
import { CollectibleAsset } from '../../models/collectible-asset';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';

@Component({
  selector: 'app-asset-details',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './asset-details.component.html',
  styleUrls: ['./asset-details.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateX(-20px)' }),
          stagger('50ms', animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })))
        ], { optional: true })
      ])
    ])
  ]
})
export class AssetDetailsComponent implements OnInit {
  asset: CollectibleAsset | null = null;
  defaultDate = new Date();

  constructor(private assetService: CollectibleAssetService) {}

  ngOnInit() {
    this.asset = this.assetService.getAsset();
  }

  formatDate(date?: Date): string {
    const d = new Date(date || this.defaultDate);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
