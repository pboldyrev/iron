import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';

@Component({
  selector: 'app-help-feedback',
  standalone: true,
  imports: [CommonModule, BluButton, MatTooltipModule, BluText],
  templateUrl: './help-feedback.component.html',
  styleUrl: './help-feedback.component.scss'
})
export class HelpFeedbackComponent {
  onClicked(): void {
    location.href = "mailto:feedback@finacle.app?subject=Finacle app feedback"
  }
}
