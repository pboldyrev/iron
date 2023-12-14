import { Component, Input } from '@angular/core';
import { BluHeading } from '../heading/heading.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'blu-toolbar',
  standalone: true,
  imports: [CommonModule, BluHeading],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class BluToolbar {
  @Input() type = 'primary';
}
