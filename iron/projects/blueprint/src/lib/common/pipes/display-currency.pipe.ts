import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayCurrency',
  standalone: true
})
export class DisplayCurrencyPipe implements PipeTransform {
  transform(value: string | null, ...args: unknown[]): string {
    if(!value) {
      return '';
    }
    value = value.replaceAll(/[^\d.-]/g,''); // remove non-digits, minus float point
    value = "$" + value;
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // add commas when needed
  }
}
