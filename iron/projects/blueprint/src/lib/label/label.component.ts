import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BluIcon } from '../icon/icon.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'blu-label',
  standalone: true,
  imports: [CommonModule, BluIcon, MatTooltipModule],
  templateUrl: './label.component.html',
  styleUrl: './label.component.css'
})
export class BluLabel {
  @Input() for!: string;
  @Input() label: string | null = null;
  @Input() required: boolean = false;
  @Input() tooltip: string = '';
}
