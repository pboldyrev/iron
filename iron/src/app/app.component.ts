import { Component, ViewEncapsulation } from '@angular/core';
import { SidebarOption } from './shared/interfaces/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = 'iron';

  public sidebarOptions: SidebarOption[] = [
    { icon: 'home', name: 'overview', link: '/' },
    { icon: 'gear', name: 'settings', link: '/settings' },
  ];
}
