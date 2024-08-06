import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { RecordModel } from 'pocketbase';
import { PocketbaseService } from '../../../services/pocketbase/pocketbase.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../environments/environment';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'dashboard-designer',
  templateUrl: './dashboard-designer.component.html',
  styleUrl: './dashboard-designer.component.scss'
})
export class DashboardDesignerComponent {

  constructor(private pb: PocketbaseService, private snackBar: MatSnackBar, private clipboard: Clipboard) {
    this.updateUI();
  }

  public data: RecordModel[] = []
  public selectedCampaign: string = '';

  private _showTitle: boolean = true;
  private _showDescription: boolean = true;
  private _backgroundColor: string = '';
  private _buttonColor: string = '#2596f8';
  private _textColor: string = '#000000';
  private _buttonBorderRadius: number = 10;
  private _buttonTxt: string = 'Join the Waitlist!';
  private _link: string = '';
  private _buttonTextColor: string = '#000000';

  // Getter and setter for each property
  get showTitle(): boolean {
    return this._showTitle;
  }
  set showTitle(value: boolean) {
    this._showTitle = value;
    this.updateUI();
  }

  get showDescription(): boolean {
    return this._showDescription;
  }
  set showDescription(value: boolean) {
    this._showDescription = value;
    this.updateUI();
  }

  get backgroundColor(): string {
    return this._backgroundColor;
  }
  set backgroundColor(value: string) {
    this._backgroundColor = value;
    this.updateUI();
  }

  get buttonColor(): string {
    return this._buttonColor;
  }
  set buttonColor(value: string) {
    this._buttonColor = value;
    this.updateUI();
  }

  get textColor(): string {
    return this._textColor;
  }
  set textColor(value: string) {
    this._textColor = value;
    this.updateUI();
  }

  get buttonBorderRadius(): number {
    return this._buttonBorderRadius;
  }
  set buttonBorderRadius(value: number) {
    this._buttonBorderRadius = value;
    this.updateUI();
  }

  get buttonTxt(): string {
    return this._buttonTxt;
  }
  set buttonTxt(value: string) {
    this._buttonTxt = value;
    this.updateUI();
  }
  get buttonTextColor(): string {
    return this._buttonTextColor;
  }
  set buttonTextColor(value: string) {
    this._buttonTextColor = value;
    this.updateUI();
  }

  get link(): string {
    return this._link;
  }
  set link(value: string) {
    this._link = value;
  }

  public readonly templateLink: string = environment.url;

  async ngOnInit() {

    try {
      this.data = await this.pb.get().collection('campaigns').getFullList({
        sort: '-created',
      });
    } catch (error: any) {
      console.error(error);
    }
  }

  copyToClipboard() {
    this.clipboard.copy(this.link);
    this.snackBar.open('Link got copied successfully.', 'Close', { duration: 5000 })
  }

  resetFields() {
    this._showTitle = true;
    this._showDescription = true;
    this._backgroundColor = '';
    this._buttonColor = '#2596f8';
    this._textColor = '#000000';
    this._buttonTextColor = '#000000';
    this._buttonBorderRadius = 10;
    this._buttonTxt = 'Join the Waitlist!';
    this._link = '';
  }


  newSelect(selectedId: string) {
    this.selectedCampaign = selectedId
    this.resetFields();
    this.updateUI();
  }

  updateUI() {
    const url = new URL(this.templateLink + '/iframe');
    const params = new URLSearchParams(url.search);

    if (this.selectedCampaign !== '') {
      params.set('campaign', this.selectedCampaign);
    }
    if (!this.showTitle) {
      params.set('showTitle', 'false');
    }
    if (!this.showDescription) {
      params.set('showDescription', 'false');
    }
    if (this.backgroundColor !== '') {
      params.set('backgroundColor', this.backgroundColor);
    }
    if (this.buttonColor !== '#2596f8') {
      params.set('buttonColor', this.buttonColor);
    }
    if (this.textColor !== '#000000') {
      params.set('textColor', this.textColor);
    }
    if (this.buttonBorderRadius !== 10) {
      params.set('buttonBorderRadius', this.buttonBorderRadius.toString());
    }
    if (this.buttonTextColor !== '#000000') {
      params.set('buttonTextColor', this.buttonTextColor);
    }
    if (this.buttonTxt !== 'Join the Waitlist!') {
      params.set('buttonTxt', this.buttonTxt);
    }

    url.search = params.toString();
    this.link = url.toString();
  }
}
