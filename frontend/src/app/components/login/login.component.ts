import { Component, OnInit } from '@angular/core';
import { PocketbaseService } from '../../services/pocketbase/pocketbase.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouteURLService } from '../../services/route-constants/route-url.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  constructor(private pb: PocketbaseService, private router: Router, private snackBar: MatSnackBar, private routeUrl: RouteURLService) { }

  async ngOnInit() {
    if (this.pb.isLoggedIn()) {
      this.router.navigate([this.routeUrl.dashboard()]);
      return;
    }

    localStorage.removeItem('selectedNavItem');
  }

  async login() {
    try {
      await this.pb.get().collection('users').authWithOAuth2({ provider: 'google' });
      this.router.navigate([this.routeUrl.dashboard()])
    } catch (error) {
      console.error(error)
      this.snackBar.open('Login was not successful. Please try again.', 'Close', { duration: 5000 });
    }
  }

}
