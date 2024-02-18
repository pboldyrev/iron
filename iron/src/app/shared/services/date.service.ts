import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  constructor() { }

  public getLatestValidDate(): Date {
    let d = new Date(new Date().setUTCDate(new Date().getUTCDate() - 1));
    d.setUTCHours(0,0,0,0)
    return d;
  }
}
