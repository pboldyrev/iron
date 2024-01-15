import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BluIcon } from '../icon/icon.component';
import { BluIconName } from '../common/constants';

@Component({
  selector: 'blu-tag',
  standalone: true,
  imports: [CommonModule, BluIcon],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.css'
})
export class BluTag {
  @Input() type: "success" | "error" | "info" | "special" = "info";
}
