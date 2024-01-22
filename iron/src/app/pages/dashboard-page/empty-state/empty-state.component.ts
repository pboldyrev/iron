import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { TEXTS } from './empty-state.strings';

@Component({
  selector: 'empty-state',
  standalone: true,
  imports: [CommonModule, BluHeading, BluText, BluButton],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss'
})
export class EmptyStateComponent {
  @Output() addBtnClicked = new EventEmitter();

  TEXTS = TEXTS;

  onAddClicked(): void {
    this.addBtnClicked.emit();
  }
}
