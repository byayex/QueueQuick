import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './src/app/components/homepage/homepage.component';
import { DashboardComponent } from './src/app/components/dashboard/dashboard.component';
import { IframeComponent } from './src/app/components/iframe/iframe.component';
import { UnsubscribeComponent } from './src/app/components/unsubscribe/unsubscribe.component';
import { AuthorizeGuard } from './src/app/guards/authorize/authorize.guard';
import { LoginComponent } from './src/app/components/login/login.component';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthorizeGuard]
  },
  {
    path: '*',
    component: HomepageComponent
  },
  {
    path: 'iframe',
    component: IframeComponent
  },
  {
    path: 'unsubscribe',
    component: UnsubscribeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
