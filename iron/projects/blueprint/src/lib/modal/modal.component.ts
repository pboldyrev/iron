import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BluHeading } from '../heading/heading.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BluIcon } from '../icon/icon.component';

@Component({
  selector: 'blu-modal',
  standalone: true,
  imports: [CommonModule, BluHeading, MatTooltipModule, BluIcon],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class BluModal {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() boldTitle: boolean = false;
  @Input() outline: boolean = true;
  @Input() titleTooltip: string = '';
}
