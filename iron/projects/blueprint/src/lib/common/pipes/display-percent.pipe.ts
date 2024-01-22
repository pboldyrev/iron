import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayPercent',
  standalone: true
})
export class DisplayPercentPipe implements PipeTransform {

  transform(value: number | null | undefined, ...args: unknown[]): string {
    if(!value) {
      return '0%';
    }

    let valueAsString;

    valueAsString = value.toFixed(2);

    if(valueAsString.charAt(0) === "-") {
      valueAsString = valueAsString.substring(1);
      valueAsString = "-" + valueAsString + "%";
    } else {
      valueAsString = valueAsString + "%";
    }
    return valueAsString.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // add commas when needed
  }

}
