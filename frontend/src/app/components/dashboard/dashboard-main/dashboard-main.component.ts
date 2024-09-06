import { Component } from '@angular/core';
import { PocketbaseService } from '../../../services/pocketbase/pocketbase.service';
import { RecordModel } from 'pocketbase';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrl: './dashboard-main.component.scss'
})
export class DashboardMainComponent {

  public totalCampaigns: number = 0;
  public totalEntries: number = 0;
  public totalMessages: number = 0;

  constructor(private pb: PocketbaseService, private snackBar: MatSnackBar) { }

  async ngOnInit() {

    try {
      var data = await this.pb.get().collection('campaigns').getFullList({
        sort: '-created',
      });

      this.totalCampaigns = data.length;

      data.forEach((record) => {
        var currentEntries = record['current_entries'] as number;
        var messagesSent = record['messages_sent'] as number;

        this.totalEntries += currentEntries;
        this.totalMessages += messagesSent;

      } )

    } catch (error: any) {
      this.snackBar.open('There was an error loading the campaigns. Please try again later.', 'Close', { duration: 5000 })
      console.error(error);
    }

  }
}
