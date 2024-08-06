import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PocketbaseService {

  private pb: PocketBase;

  private baseUrl: string = environment.apiUrl + '/api/queueQuick/';

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
      
      const url = new URL(this.baseUrl + 'getAvailableChannels');
      const params = new URLSearchParams(url.search);

      params.set('campaign_id', campaign_id)

      url.search = params.toString();

      const response = await fetch(url, {
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

      const url = new URL(this.baseUrl + 'addSelfToCampaign');
      const params = new URLSearchParams(url.search);

      params.set('campaign_id', campaign_id)
      params.set('channel_id', channel_id)
      params.set('details', details)

      url.search = params.toString();

      const response = await fetch(url, {
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

      const url = new URL(this.baseUrl + 'removeSelfFromCampaign');
      const params = new URLSearchParams(url.search);

      params.set('campaign_id', campaign_id)
      params.set('entry_id', entry_id)

      url.search = params.toString();

      const response = await fetch(url, {
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

      const url = new URL(this.baseUrl + 'sendNotification');
      const params = new URLSearchParams(url.search);

      params.set('campaign_id', campaign_id)

      url.search = params.toString();

      const data = new URLSearchParams();
      data.append('subject', subject);
      data.append('message', message);

      const response = await fetch(url, {
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
