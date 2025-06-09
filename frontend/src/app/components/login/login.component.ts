import { Component, OnInit } from '@angular/core';
import { PocketbaseService } from '../../services/pocketbase/pocketbase.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouteURLService } from '../../services/route-constants/route-url.service';
import { environment } from '../../../environments/environment';

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

      if (environment.production) {
        // Prod Login
        await this.pb.get().collection('users').authWithOAuth2({ provider: 'google' });
      } else {
        // Debug Login
        await this.pb.get().collection('users').authWithPassword('admin@admin.admin', 'admin@admin.admin');
      }

      this.router.navigate([this.routeUrl.dashboard()]);
    } catch (error) {
      console.error(error)
      this.snackBar.open('Login was not successful. Please try again.', 'Close', { duration: 5000 });
    }
  }

}
