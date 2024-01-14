import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { TEXTS } from './loading-state.strings';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, BluHeading],
  templateUrl: './loading-state.component.html',
  styleUrl: './loading-state.component.scss'
})
export class LoadingStateComponent {
  @Input() loadingText = TEXTS.DEFAULT_TEXT;
  
  TEXTS = TEXTS
}
