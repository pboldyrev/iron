import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { octSync } from '@ng-icons/octicons';

@Component({
  selector: 'blu-spinner',
  imports: [NgIconComponent],
  standalone: true,
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
  viewProviders: [
    provideIcons({
      octSync,
    }),
  ],
})
export class BluSpinner {}
