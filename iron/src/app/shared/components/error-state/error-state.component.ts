import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [CommonModule, BluHeading, BluButton, BluText],
  templateUrl: './error-state.component.html',
  styleUrl: './error-state.component.scss'
})
export class ErrorStateComponent {
  onReloadPage(): void {
    location.reload();
  }
}
