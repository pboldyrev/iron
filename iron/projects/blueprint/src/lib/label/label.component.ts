import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'blu-label',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './label.component.html',
  styleUrl: './label.component.css'
})
export class BluLabel {
  @Input() for!: string;
  @Input() label: string | null = null;
  @Input() required: boolean = false;
}
