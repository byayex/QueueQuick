import { Component } from '@angular/core';
import { PocketbaseService } from '../../services/pocketbase/pocketbase.service';
import { Router } from '@angular/router';
import { RouteURLService } from '../../services/route-constants/route-url.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private pb: PocketbaseService, private router: Router, private routeUrl: RouteURLService){}

  async ngOnInit()
  {
    if(this.pb.isLoggedIn())
      {
        this.router.navigate([this.routeUrl.dashboard()]) 
      }
  }

  async login()
  {
    await this.pb.get().collection('users').authWithOAuth2({ provider: 'google' });
    this.router.navigate([this.routeUrl.dashboard()])
  }

}
