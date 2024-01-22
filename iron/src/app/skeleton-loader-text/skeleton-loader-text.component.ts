import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader-text',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-loader-text.component.html',
  styleUrl: './skeleton-loader-text.component.scss'
})
export class SkeletonLoaderTextComponent {
  @Input() size: "s" | "m" | "l" = "m";
  @Input() height = 18;
  @Input() curved: "s" | "m" | "l" = "s";
}
