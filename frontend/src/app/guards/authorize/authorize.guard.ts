import { Injectable } from '@angular/core';
import {  ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { PocketbaseService } from '../../services/pocketbase/pocketbase.service';
import { RouteURLService } from '../../services/route-constants/route-url.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorizeGuard {

  constructor(private router: Router, private pb: PocketbaseService, private routeURL: RouteURLService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isLoggedIn = this.pb.isLoggedIn();

    if (!isLoggedIn) {
      this.router.navigate([this.routeURL.login()]);
      return false;
    }
    
    return true;
  }
}