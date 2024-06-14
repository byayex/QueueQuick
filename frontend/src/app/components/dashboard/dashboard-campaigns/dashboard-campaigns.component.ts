import { Component } from '@angular/core';
import { PocketbaseService } from '../../../services/pocketbase/pocketbase.service';
import { RecordModel } from 'pocketbase';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'dashboard-campaigns',
  templateUrl: './dashboard-campaigns.component.html',
  styleUrl: './dashboard-campaigns.component.scss'
})
export class DashboardCampaignsComponent {

  public data: RecordModel[] = []
  public displayedColumns = ['title', 'description', 'current_entries', 'active', 'manage']

  public title = '';
  public description = '';
  public active = true;

  public currentSelectedId = '';

  constructor(private pb: PocketbaseService,
    private snackBar: MatSnackBar
  ) { }

  async ngOnInit() {
    try {
      this.data = await this.pb.get().collection('campaigns').getFullList({
        sort: '-created',
      });
    } catch (error: any) {
      console.error(error);
    }
  }

  async loadCampaignIntoEdit(id: string) {
    const result = this.data.find(element => element.id == id);

    if(result)
      {
        this.currentSelectedId = result.id;
        this.title = result['title']
        this.description = result['description']
        this.active = result['active']
      }
  }

  async submitClick() {

    if(this.title.trim().length < 3)
      {
        this.snackBar.open(`Please fill in a title with more than 2 characters`, 'Close', { duration: 5000 })
        return;
      }

    const data = {
      "owner": this.pb.returnModelData("id"),
      "title": this.title,
      "description": this.description,
      "active": this.active
    }

    try {
      if (this.currentSelectedId == '') {
        await this.pb.get().collection('campaigns').create(data);
      } else {
        await this.pb.get().collection('campaigns').update(this.currentSelectedId, data);
      }

      this.snackBar.open(`The campaign got ${this.currentSelectedId == '' ? 'created' : 'edited'}`, 'Close', { duration: 5000 })

      this.title = '';
      this.description = '';
      this.active = true;
      this.currentSelectedId = '';

      this.ngOnInit();
    } catch (error: any) {
      this.snackBar.open(error, 'Close', { duration: 5000 })
    }
  }

  async deleteCampaign(id: string) {
    try {
      await this.pb.get().collection('campaigns').delete(id);
      this.snackBar.open('The campaign got deleted', 'Close', { duration: 500000 })
      this.ngOnInit();
    } catch (error: any) {
      this.snackBar.open(error, 'Close', { duration: 5000 })
    }
  }

  async abortEdit() {
    this.currentSelectedId = '';
    this.title = '';
    this.description = ''
    this.active = true;
  }

}
