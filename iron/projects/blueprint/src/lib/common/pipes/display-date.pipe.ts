import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayDate',
  standalone: true
})
export class DisplayDatePipe implements PipeTransform {

  transform(value: number): string {
    if(!value) {
      return "Date error";
    }
    return new Date(value).toLocaleDateString('en-US', {timeZone: 'UTC'});
  }

}
