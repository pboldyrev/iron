import { Component, Input } from '@angular/core';
import { BluSelectOption } from '../common/constants';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'blu-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class BluSelect {
  @Input() options!: BluSelectOption[];

  @Input() size: 'small' | 'medium' | 'large' = 'small';
  @Input() type: 'primary' | 'secondary' = 'secondary';

  ngOnInit() {
    this.options.forEach((option: BluSelectOption) => {
      if(option.selected) {
        this.value$.next(option.text);
      }
    });
  }

  public value$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  public updateValue(event: any): void {
    this.value$.next(event.target.value);
  }
}
