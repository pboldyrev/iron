import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  public initialize() {
    
  }

  public track(eventName: string, properties: any = {}): void {
    try {
      console.log(eventName, properties);
    } catch {
      console.log("ERROR: Failed to track an event.");
    }
  }
}
