import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluPopup } from 'projects/blueprint/src/lib/popup/popup.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { BehaviorSubject, timer } from 'rxjs';

@Component({
  selector: 'ai-feedback-popup',
  standalone: true,
  imports: [CommonModule, BluPopup, BluHeading, BluText, MatProgressBarModule],
  templateUrl: './ai-feedback-popup.component.html',
  styleUrl: './ai-feedback-popup.component.scss'
})
export class AiFeedbackPopupComponent {
  @ViewChild('feedbackPopup') feedbackPopup!: BluPopup

  public aiFeedback$ = new BehaviorSubject<string>("");
  
  public show(): void {
    this.feedbackPopup.show();
    timer(1000).subscribe(() => {this.aiFeedback$.next("Hello world!")})
  }
}
