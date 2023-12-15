import { Component, Input } from '@angular/core';
import { BluSelectOption } from '../common/constants';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { BluLabel } from '../label/label.component';

@Component({
  selector: 'blu-select',
  standalone: true,
  imports: [CommonModule, BluLabel],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class BluSelect {
  @Input() options!: BluSelectOption[];

  @Input() size: 'small' | 'medium' | 'large' = 'small';
  @Input() type: 'primary' | 'secondary' = 'secondary';
  @Input() required: boolean = false;
  @Input() label: string | null = null;

  public value$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public isValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  ngOnInit() {
    let hasSelected = false;

    this.options.forEach((option: BluSelectOption) => {
      if(option.selected) {
        this.value$.next(option.text);
        hasSelected = true;
      }
    });

    if(!hasSelected&& this.options.length > 0) {
      this.value$.next(this.options[0].text);
    }
  }

  public updateValue(event: any): void {
    this.value$.next(event.target.value);
  }

  public validate(): void {
    this.value$.subscribe((value: string) => {
      if(value != "") {
        this.isValid$.next(true);
      }
    });
  }
}
