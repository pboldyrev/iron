import { Component, ViewEncapsulation } from '@angular/core';
import { AnalyticsService } from './shared/services/analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = 'iron';

  constructor(
    private analyticsService: AnalyticsService,
  ) {
    this.analyticsService.initialize();
  }
}
