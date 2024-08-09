import { Component, Input, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { PocketbaseService } from '../../services/pocketbase/pocketbase.service';
import { RecordModel } from 'pocketbase';

@Component({
  selector: 'iframe-comp',
  templateUrl: './iframe.component.html',
  styleUrl: './iframe.component.scss'
})
export class IframeComponent {

  @Input() campaign: string = ''
  @Input() showTitle: boolean = true;
  @Input() showDescription: boolean = true;
  @Input() backgroundColor: string = '';
  @Input() buttonColor: string = '#2596f8';
  @Input() textColor: string = '#000000';
  @Input() buttonBorderRadius: number = 10;
  @Input() buttonTextColor: string = '#000000';
  @Input() buttonTxt: string = 'Join the Waitlist!';

  public title: string = '';
  public description: string = '';

  public currentStep: 0 | 1 | 2 | 3 | 4 = 0;

  private textLoading: boolean = false;

  public availableChannels: RecordModel[] | undefined;

  public selectedChannel: RecordModel | undefined;

  public contactMethod: string = '';

  public initialLoading: boolean = true;
  public campaginExists: boolean = true;

  constructor(private route: ActivatedRoute, private snack: MatSnackBar, public pb: PocketbaseService, private snackBar: MatSnackBar, ) { }

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(params => {
      if (params['campaign']) this.campaign = params['campaign'];
      if (params['showTitle']) this.showTitle = params['showTitle'];
      if (params['showDescription']) this.showDescription = params['showDescription'];
      if (params['backgroundColor']) this.backgroundColor = params['backgroundColor'];
      if (params['buttonColor']) this.buttonColor = params['buttonColor'];
      if (params['textColor']) this.textColor = params['textColor'];
      if (params['buttonTextColor']) this.buttonTextColor = params['buttonTextColor'];
      if (params['buttonBorderRadius']) this.buttonBorderRadius = parseInt(params['buttonBorderRadius']);
    });

    if (localStorage.getItem(this.campaign)) {
      this.currentStep = 3;
      return;
    }

    await this.loadText();
    this.initialLoading = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['campaign']) {
      this.loadText();
    }
  }

  async loadText() {
    if (this.campaign == '' || this.textLoading) {
      return;
    }
    this.textLoading = true;

    try {
      const record = await this.pb.get().collection('campaigns').getOne(this.campaign);

      this.title = record["title"];
      this.description = record["description"];

    } catch (error) {
      this.snack.open('The campaign does not exist.', 'Close', { duration: 5000 })
      this.campaginExists = false;
    } finally {
      this.textLoading = false;
    }
  }

  async clickJoinWaitlist() {
    try {
      this.currentStep = 1
      const channels = await this.pb.getAvailableChannels(this.campaign);

      let filter = '';

      channels.forEach((channel, index) => {
        if (index > 0) {
          filter += ' || ';
        }
        filter += `id = "${channel}"`;
      });

      this.availableChannels = await this.pb.get().collection('channels').getFullList({ filter: filter });
    } catch (error) {
      this.snackBar.open('There was an error loading the channels. Please try again.', 'Close', { duration: 5000 })
    }
  }

  returnChannelLogo(record: RecordModel) {
    return this.pb.get().files.getUrl(record, record['logo'])
  }

  selectChannel(channel: RecordModel) {
    this.currentStep = 2;
    this.selectedChannel = channel;
  }

  returnContactMethods() {
    let contactMethodString = '';

    if (this.selectedChannel == null) {
      return contactMethodString;
    }

    const contactMethods = this.selectedChannel["contact_methods"] as string[];

    contactMethods.forEach((element, index) => {

      if (index == 0) {
        contactMethodString += element;
      }
      else if (index == contactMethods.length - 1) {
        contactMethodString += ` or ${element}`
      } else {
        contactMethodString += `, ${element}`
      }
    });

    return contactMethodString;
  }

  async onSubmit() {
    try {
      await this.pb.addSelfToCampaign(this.campaign, this.selectedChannel?.id ?? '', this.contactMethod);

      this.currentStep = 3;

      localStorage.setItem(this.campaign, 'entry');

    } catch (error) {
      this.currentStep = 4;
      setTimeout(() => {
        this.currentStep = 0;
      }, 15_000)
    }
  }
}
