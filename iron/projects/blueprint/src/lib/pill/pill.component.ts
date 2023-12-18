import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'blu-pill',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pill.component.html',
  styleUrl: './pill.component.css'
})
export class BluPill {
  @Input() selected: boolean = false;
}
