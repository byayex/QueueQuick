import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RouteURLService {

  constructor() { }

  homepage(): string { return '' }
  dashboard(): string { return 'dashboard' }
  login(): string { return 'login' }
}
