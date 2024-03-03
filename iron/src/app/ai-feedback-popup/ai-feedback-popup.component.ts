import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluPopup } from 'projects/blueprint/src/lib/popup/popup.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { BehaviorSubject, timer } from 'rxjs';
import { DataService } from '../shared/services/data.service';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluIcon } from 'projects/blueprint/src/lib/icon/icon.component';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';

@Component({
  selector: 'ai-feedback-popup',
  standalone: true,
  imports: [
    CommonModule,
    BluIcon,
    BluButton,
    BluPopup,
    BluHeading,
    BluText,
    MatProgressBarModule,
    MarkdownModule,
  ],
  providers: [MarkdownService],
  templateUrl: './ai-feedback-popup.component.html',
  styleUrl: './ai-feedback-popup.component.scss',
})
export class AiFeedbackPopupComponent {
  @ViewChild('feedbackPopup') feedbackPopup!: BluPopup;

  public aiFeedback$ = new BehaviorSubject<string>('');

  constructor(private dataService: DataService) {}

  public show(): void {
    this.feedbackPopup.show();
    this.dataService.getAIFeedback$().subscribe((response: string) => {
      this.aiFeedback$.next(response);
    });
  }

  onFeedback(): void {
    location.href =
      'mailto:feedback@finacle.app?subject=Finacle AI feedback';
  }
}
