import { Component, ElementRef, HostListener, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface NavLink {
  id: string;
  label: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-quick-nav',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './quick-nav.component.html',
  styleUrls: ['./quick-nav.component.scss']
})
export class QuickNavComponent implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  /** Distance from the top of the document to this component's natural position. */
  private originTop = 0;
  /** Height of the nav bar, used for the spacer that prevents a layout jump. */
  navHeight = 0;
  /** Whether the nav has scrolled past its natural position and should stick. */
  isStuck = false;

  navLinks: NavLink[] = [
    {
      id: 'asset-details',
      label: 'Asset Details',
      icon: 'info',
      description: 'Key information & specs'
    },
    {
      id: 'performance-analytics',
      label: 'Performance',
      icon: 'trending_up',
      description: 'Value appreciation & ROI'
    },
    {
      id: 'transaction-history',
      label: 'Transactions',
      icon: 'history',
      description: 'Sales & appraisal history'
    }
  ];

  ngOnInit(): void {
    this.measure();
    this.checkScrollPosition();
  }

  ngOnDestroy(): void {
    // no manual listeners to clean up; @HostListener handles window events
  }

  @HostListener('window:resize')
  measure(): void {
    const nav = this.elementRef.nativeElement.querySelector('.quick-nav') as HTMLElement | null;
    if (!nav) {
      return;
    }

    // If currently stuck, momentarily release to measure the true document
    // offset, otherwise offsetTop would reflect the fixed position instead.
    const wasStuck = this.isStuck;
    if (wasStuck) {
      this.isStuck = false;
    }

    this.navHeight = nav.offsetHeight;
    this.originTop = nav.getBoundingClientRect().top + window.scrollY;

    if (wasStuck) {
      this.isStuck = true;
    }
  }

  @HostListener('window:scroll')
  checkScrollPosition(): void {
    const currentScrollY = window.scrollY;
    // Once the viewport has scrolled past the component's natural top
    // position, the two values diverge — that's when we apply the sticky
    // (fixed) position. Scrolling back up re-aligns them and releases it.
    this.isStuck = currentScrollY >= this.originTop;
  }

  scrollToSection(componentSelector: string) {
    const section = document.querySelector(componentSelector);
    if (!section) {
      return;
    }

    // Offset by the nav's height (plus a small gap) so the fixed/stuck nav
    // doesn't cover the top of the target section.
    const offset = this.navHeight + 16;
    const targetTop = section.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

