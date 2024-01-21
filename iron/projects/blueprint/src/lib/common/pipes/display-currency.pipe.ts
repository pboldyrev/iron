import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayCurrency',
  standalone: true
})
export class DisplayCurrencyPipe implements PipeTransform {
  transform(value: number | null | undefined, ...args: unknown[]): string {
    if(!value) {
      return '$0.00';
    }

    let valueAsString;

    if(Math.abs(value) < 1) {
      valueAsString = value.toFixed(2);
    } else {
      valueAsString = value.toFixed(0);
    }

    if(valueAsString.charAt(0) === "-") {
      valueAsString = valueAsString.substring(1);
      valueAsString = "-$" + valueAsString;
    } else {
      valueAsString = "$" + valueAsString;
    }
    return valueAsString.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // add commas when needed
  }
}
