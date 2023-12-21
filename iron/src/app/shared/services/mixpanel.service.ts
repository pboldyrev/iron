import { Injectable } from '@angular/core';
import mixpanel from 'mixpanel-browser';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MixpanelService {

  constructor(
    private authService: AuthService,
  ) { }

  public initialize() {
    const apiKey = process.env['API_MIXPANEL'];

    if(!apiKey) {
      console.log("FAILED TO INITIALIZE MIXPANEL");
      return;
    }

    mixpanel.init(apiKey, {debug: true, track_pageview: true, persistence: 'localStorage'});
    mixpanel.identify(this.authService.getSessionToken());
  }

  public track(eventName: string, properties: any = {}): void {
    mixpanel.track(eventName, properties);
  }
}
