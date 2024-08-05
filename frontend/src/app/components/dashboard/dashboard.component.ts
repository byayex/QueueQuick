import { Component, HostListener } from '@angular/core';
import { PocketbaseService } from '../../services/pocketbase/pocketbase.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  private selectedNavItem = '';

  public highlightTop = '0px';
  public highlightHeight = '0px';
  public highlightWidth = '0px';
  public highlightLeft = '0px';

  constructor(public pb: PocketbaseService) { }

  ngOnInit(): void {
    const storedNavItem = localStorage.getItem('selectedNavItem') ?? 'dashboard';

    this.selectNavItem(storedNavItem);

    window.onload = () => {
      this.scaleElementById(this.selectedNavItem);
    };
  }

  @HostListener('window:resize')
  onResize() {
    this.scaleElementById(this.selectedNavItem);
  }

  async scaleElementById(navItem: string) {
    const element = document.getElementById(navItem);
    if (element) {
      this.highlightTop = `${element.offsetTop}px`;
      this.highlightHeight = `${element.offsetHeight}px`;
      this.highlightLeft = `${element.offsetLeft}px`;
      this.highlightWidth = `${element.offsetWidth}px`
    }
  }

  selectNavItem(navItem: string) {
    this.scaleElementById(navItem);
    localStorage.setItem('selectedNavItem', navItem);
    this.selectedNavItem = navItem;
  }

  getCurrentNavItem(): string {
    return this.selectedNavItem;
  }

}
