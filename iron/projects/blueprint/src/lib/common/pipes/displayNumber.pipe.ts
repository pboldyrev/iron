import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayNumber',
  standalone: true
})
export class DisplayNumberPipe implements PipeTransform {
  transform(value: string | null, ...args: unknown[]): string {
    if(!value) {
      return '';
    }
    value = value.replaceAll(",", "");
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
