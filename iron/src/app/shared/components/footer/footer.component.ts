import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BluLink } from 'projects/blueprint/src/lib/link/link.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, BluText, BluLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

}
