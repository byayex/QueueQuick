import { Component, Input } from '@angular/core';

@Component({
  selector: 'dashboard-template',
  templateUrl: './dashboard-template.component.html',
  styleUrl: './dashboard-template.component.scss'
})
export class DashboardTemplateComponent {
  @Input() title_str: string = '';
  @Input() backgroundColor: string = 'transparent';
  @Input() description: string = ' ';
}
