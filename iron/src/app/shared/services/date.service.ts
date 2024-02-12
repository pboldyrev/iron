import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  constructor() { }

  public getLatestValidDate(): Date {
    return new Date(new Date().setDate(new Date().getDate() - 1));
  }
}
