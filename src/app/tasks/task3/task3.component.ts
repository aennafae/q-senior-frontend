import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CollectibleDashboardComponent } from '../../components/collectible-dashboard/collectible-dashboard.component';

@Component({
  selector: 'app-task3',
  standalone: true,
  imports: [CollectibleDashboardComponent],
  templateUrl: './task3.component.html',
  styleUrl: './task3.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Task3Component {}
