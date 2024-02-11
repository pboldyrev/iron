import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  constructor() { }

  public getLatestValidDate(): number {
    return new Date((new Date(new Date())).setDate(new Date(new Date().toISOString()).getDate() - 1)).getTime();
  }

  public getDateAsUTC(date: string | number | Date): number {
    return new Date(new Date(date).toISOString()).getTime();
  }

  public getDisplayTimestamp(date: string | number | Date): string {
    return new Date(date).toLocaleDateString('en-US', {timeZone: 'UTC'})
  }
}
