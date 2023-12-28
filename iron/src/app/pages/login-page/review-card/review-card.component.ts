import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [CommonModule, BluHeading, BluText],
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.scss'
})
export class ReviewCardComponent {

}
