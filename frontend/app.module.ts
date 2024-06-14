import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './src/app/components/app/app.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HomepageComponent } from './src/app/components/homepage/homepage.component';
import { DashboardComponent } from './src/app/components/dashboard/dashboard.component';
import { MatDividerModule } from '@angular/material/divider';
import { DashboardMainComponent } from './src/app/components/dashboard/dashboard-main/dashboard-main.component';
import { MatMenuModule } from '@angular/material/menu';
import { DashboardProfileComponent } from './src/app/components/dashboard/dashboard-profile/dashboard-profile.component';
import { DashboardTemplateComponent } from './src/app/components/dashboard/dashboard-template/dashboard-template.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { DashboardDesignerComponent } from './src/app/components/dashboard/dashboard-designer/dashboard-designer.component';
import { DashboardCampaignsComponent } from './src/app/components/dashboard/dashboard-campaigns/dashboard-campaigns.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ColorPickerModule } from 'ngx-color-picker';
import { IframeComponent } from './src/app/components/iframe/iframe.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { UnsubscribeComponent } from './src/app/components/unsubscribe/unsubscribe.component';
import { LoginComponent } from './src/app/components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    DashboardComponent,
    DashboardMainComponent,
    DashboardProfileComponent,
    DashboardTemplateComponent,
    DashboardDesignerComponent,
    DashboardCampaignsComponent,
    IframeComponent,
    UnsubscribeComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatMenuModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSelectModule,
    ColorPickerModule
  ],
  providers: [provideAnimations()],
  bootstrap: [AppComponent]
})
export class AppModule { }
