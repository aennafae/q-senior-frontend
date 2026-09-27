import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CollectibleAssetService } from '../../../services/collectible-asset.service';
import { CollectibleAsset } from '../../../models/collectible-asset';

@Component({
  selector: 'app-asset-header',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './asset-header.component.html',
  styleUrls: ['./asset-header.component.scss']
})
export class AssetHeaderComponent implements OnInit {
  asset: CollectibleAsset | null = null;
  currentImageIndex = 0;

  constructor(private assetService: CollectibleAssetService) {}

  ngOnInit() {
    this.asset = this.assetService.getAsset();
  }

  nextImage() {
    if (this.asset) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.asset.images.length;
    }
  }

  previousImage() {
    if (this.asset) {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.asset.images.length) % this.asset.images.length;
    }
  }

  get currentImage(): string {
    return this.asset?.images[this.currentImageIndex] || '';
  }
}
