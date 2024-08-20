import { Component, OnInit } from '@angular/core';
import { PocketbaseService } from '../../../services/pocketbase/pocketbase.service';
import { Router } from '@angular/router';
import { RouteURLService } from '../../../services/route-constants/route-url.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { channels_enabled, email } from '../../../models/channels';

@Component({
  selector: 'dashboard-profile',
  templateUrl: './dashboard-profile.component.html',
  styleUrl: './dashboard-profile.component.scss'
})
export class DashboardProfileComponent implements OnInit {

  public email: string = '';
  public username: string = '';

  public email_settings: email = this.getDefaultEmail();

  public channel_enabled: channels_enabled = {
    email: ''
  }
  public channel_active: channels_enabled = {
    email: ''
  }

  constructor(public pb: PocketbaseService,
    private router: Router,
    private routeUrl: RouteURLService,
    private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.email = this.pb.returnModelData('email') ?? '';
    this.username = this.pb.returnModelData('username') ?? '';
    this.loadChannelData();
  }

  usernameNotNew(): boolean {
    const otherUsername = this.pb.returnModelData('username')?.trim().toLowerCase() ?? '';
    return otherUsername == this.username.trim().toLowerCase()
  }
  clickLogout(): void {
    this.pb.logout();
    this.router.navigate([this.routeUrl.homepage()])
  }
  async saveUsername() {
    const data = {
      "username": this.username,
    }
    try {
      await this.pb.get().collection('users').update(this.pb.returnModelData('id'), data);
      this.snackBar.open('Your username got updated.', 'Close', { duration: 5000 })
    } catch (error: any) {
      this.snackBar.open(error.response.data.username.message, 'Close', { duration: 5000 })
    }
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  async loadChannelData() {
    try {

      const records = await this.pb.get().collection('channels').getFullList({
        sort: '-created',
        filter: 'active = True'
      });

      records.forEach(async record => {
        switch (record['name']) {
          case 'email':
            {
              this.channel_enabled.email = record.id;

              const config = await this.pb.get().collection('channels_config').getFirstListItem(`user = '${this.pb.returnModelData('id')}' && channel = '${record.id}'`)
              this.email_settings = config['config']
              this.channel_active.email = config.id;
            }
        }
      })

    } catch (error) {
      console.error(error);
      this.snackBar.open('There was an error loading the channel data. Please try again later.', 'Close', { duration: 5000 })
    }
  }

  compareJsonObjects(obj1: any, obj2: any)
  {
    return JSON.stringify(obj1) === JSON.stringify(obj2) ;
  }

  async saveEmailData() {
    try {

      const existingRecord = (await this.pb.get().collection('channels_config').getFullList({
        filter: `channel = '${this.channel_enabled.email}' && user = '${this.pb.returnModelData('id')}'`
      }))

      const data = {
        "user": this.pb.returnModelData('id'),
        "channel": this.channel_enabled.email,
        "config": this.email_settings,
      };

      if (existingRecord.length > 0) {
        await this.pb.get().collection('channels_config').update(existingRecord[0].id, data);
      } else {
        const result = await this.pb.get().collection('channels_config').create(data);
        this.channel_active.email = result.id;
      }


      this.snackBar.open('Saved Email data successfully.', 'Close', { duration: 5000 })
    } catch (error) {
      this.snackBar.open('Couldnt save email settings', 'Close', { duration: 5000 })
    }
  }

  getDefaultEmail(): email {
    return {
      host: '',
      password: '',
      username: '',
      port: 465,
      sender_address: '',
      sender_name: '',
    };
  }

  async removeEmailData() {
    try {

      const existingRecord = (await this.pb.get().collection('channels_config').getFullList({
        filter: `channel = '${this.channel_enabled.email}' && user = '${this.pb.returnModelData('id')}'`
      }))

      await this.pb.get().collection('channels_config').delete(existingRecord[0].id);

      this.email_settings = this.getDefaultEmail();

      this.snackBar.open('Deleted Email data successfully.', 'Close', { duration: 5000 })
      this.channel_active.email = '';
    } catch (error) {
      this.snackBar.open('Couldnt delete email settings', 'Close', { duration: 5000 })
    }
  }

}
