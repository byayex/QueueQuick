import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PocketbaseService } from '../../services/pocketbase/pocketbase.service';
import { RouteURLService } from '../../services/route-constants/route-url.service';

@Component({
  selector: 'components-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrl: './unsubscribe.component.scss'
})
export class UnsubscribeComponent implements OnInit {

  constructor(private route: ActivatedRoute, private pb: PocketbaseService, private router: Router, private routeConst: RouteURLService) { }

  private campaign: string = '';
  private entry: string = '';

  public buttonClicked: boolean = false;

  public removeState: 'pending' | 'success' | 'error' = 'pending'

  async ngOnInit(): Promise<void> {

    this.route.queryParams.subscribe(params => {
      if (params['campaign']) this.campaign = params['campaign'];
      if (params['entry']) this.entry = params['entry'];
    });

    if (this.campaign == '' || this.entry == '') {
       this.router.navigate([this.routeConst.homepage()])
    }
  }

  async unsubscribe() {
    try {
      this.buttonClicked = true;
      const result = await this.pb.removeSelfFromCampaign(this.campaign, this.entry);

      if (result) {
        this.removeState = 'success'
        return;
      }

      this.removeState = 'error'
    } catch (error) {
      this.removeState = 'error'
    }
  }

}
