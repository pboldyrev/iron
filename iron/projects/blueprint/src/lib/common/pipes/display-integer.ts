import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayInteger',
  standalone: true
})
export class DisplayIntegerPipe implements PipeTransform {
  transform(value: string | null, ...args: unknown[]): string {
    if(!value) {
      return '';
    }
    value = value.replaceAll(/[^\d-]/g,''); // remove non-digits
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // add commas when needed
  }
}
