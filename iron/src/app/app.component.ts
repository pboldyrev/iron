import { Component, ViewEncapsulation } from '@angular/core';
import { MixpanelService } from './shared/services/mixpanel.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = 'iron';

  constructor(
    private mixpanelService: MixpanelService,
  ) {
    this.mixpanelService.initialize();
  }
}
