import { Component, Input } from '@angular/core';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { Asset } from '../shared/constants/constants';
import { CommonModule } from '@angular/common';
import { BluTag } from 'projects/blueprint/src/lib/tag/tag.component';

@Component({
  selector: 'app-movers',
  standalone: true,
  imports: [CommonModule, BluModal, BluHeading, BluText, BluTag],
  templateUrl: './movers.component.html',
  styleUrl: './movers.component.scss'
})
export class MoversComponent {
  @Input() assets = [] as Asset[];
}
