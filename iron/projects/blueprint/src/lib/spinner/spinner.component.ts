import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BluIcon } from '../icon/icon.component';

@Component({
  selector: 'blu-spinner',
  imports: [CommonModule, BluIcon],
  standalone: true,
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
})
export class BluSpinner {
  @Input() size: string = "16";
  @Input() inlineSpace: boolean = false;
}
