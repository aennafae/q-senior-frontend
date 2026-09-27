import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CollectibleAssetService } from '../../../services/collectible-asset.service';
import { CollectibleAsset } from '../../../models/collectible-asset';

@Component({
  selector: 'app-asset-details',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './asset-details.component.html',
  styleUrls: ['./asset-details.component.scss']
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
