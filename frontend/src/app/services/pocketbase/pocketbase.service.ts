import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PocketbaseService {

  private pb: PocketBase;

  constructor() {
    this.pb = new PocketBase(environment.apiUrl);
    this.validateLogin();
  }

  // This will try to validate the login and refresh the tokens
  async validateLogin() {
    if (!this.pb.authStore.isValid && this.pb.authStore.token) {
      await this.pb.collection('users').authRefresh();
    }
  }

  get(): PocketBase {
    return this.pb;
  }

  isLoggedIn(): boolean {
    this.validateLogin();
    return this.pb.authStore.isValid;
  }

  returnModelData(key: string): string {
    return this.pb.authStore.model?.[key] ?? ''
  }
  
  async getAvailableChannels(campaign_id: string): Promise<string[]> {
    try {

      const apiUrl = environment.apiUrl + '/api/queueQuick/' + 'getAvailableChannels?campaign_id=' + campaign_id;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      throw new Error('Error fetching data: ' + error);
    }
  }
  
  async addSelfToCampaign(campaign_id: string, channel_id: string, details: string): Promise<boolean> {
    try {

      const apiUrl = environment.apiUrl + '/api/queueQuick/addSelfToCampaign' + `?campaign_id=${campaign_id}&channel_id=${channel_id}&details=${details}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': this.pb.authStore.token
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return true;

    } catch (error) {
      throw new Error('Error fetching data: ' + error);
    }
  }

  async removeSelfFromCampaign(campaign_id: string, entry_id: string): Promise<boolean> {
    try {

      const apiUrl = environment.apiUrl + '/api/queueQuick/removeSelfFromCampaign' + `?campaign_id=${campaign_id}&entry_id=${entry_id}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': this.pb.authStore.token
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return true;

    } catch (error) {
      throw new Error('Error fetching data: ' + error);
    }
  }

  async sendNotification(campaign_id: string, subject: string, message: string): Promise<boolean> {
    try {
        const apiUrl = environment.apiUrl + '/api/queueQuick/sendNotification' + `?campaign_id=${campaign_id}`;
        
        const data = new URLSearchParams();
        data.append('subject', subject);
        data.append('message', message);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': this.pb.authStore.token
            },
            body: data.toString(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return true;
    } catch (error) {
        throw new Error('Error sending notification: ' + error);
    }
}

  logout() {
    this.pb.authStore.clear();
  }


}
