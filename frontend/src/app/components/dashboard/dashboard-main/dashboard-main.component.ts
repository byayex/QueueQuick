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

  // Notification Stuff
  public securityTask: boolean = false;
  public subject: string = '';
  public message: string = '';

  public selectedCampaign: string = '';

  public campaigns: RecordModel[] = [];

  constructor(private pb: PocketbaseService, private snackBar: MatSnackBar) { }

  async ngOnInit() {

    try {
      var data = await this.pb.get().collection('campaigns').getFullList({
        sort: '-created',
      });

      this.totalCampaigns = data.length;
      this.campaigns = data;

      data.forEach((record) => {
        var currentEntries = record['current_entries'] as number;
        var messagesSent = record['messages_sent'] as number;

        this.totalEntries += currentEntries;
        this.totalMessages += messagesSent;

      })

    } catch (error: any) {
      this.snackBar.open('There was an error loading the campaigns. Please try again later.', 'Close', { duration: 5000 })
      console.error(error);
    }

  }

  newSelect(selectedId: string) {
    this.selectedCampaign = selectedId;
  }

  async sendNotifications() {

    if (!this.securityTask) {
      this.snackBar.open('Please tick the confirmation field.', 'Close', { duration: 5000 })
      return;
    }

    if (this.message.trim() === '' || this.subject.trim() === '') {
      this.snackBar.open('Please provide a subject and a message.', 'Close', { duration: 5000 })
      return;
    }

    try {
      this.pb.sendNotification(this.selectedCampaign, this.subject, this.message)
      this.snackBar.open('We started to send the notification.', 'Close', { duration: 5000 })
    } catch (error) {
      this.snackBar.open('An error occured. Please try again later or contact the support.', 'Close', { duration: 5000 })
    }

  }
}
