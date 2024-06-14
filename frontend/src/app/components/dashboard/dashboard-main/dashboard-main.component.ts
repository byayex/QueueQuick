import { Component } from '@angular/core';
import { PocketbaseService } from '../../../services/pocketbase/pocketbase.service';

@Component({
  selector: 'dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrl: './dashboard-main.component.scss'
})
export class DashboardMainComponent {

  constructor(private pb: PocketbaseService) { }

  async blabal() {
    const result = await this.pb.sendNotification("oudhjv1ch57sqwq", "Subjecttest", "oh nien eine email")

    console.log(result);
  }
}
