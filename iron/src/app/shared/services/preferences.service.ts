import { Injectable } from '@angular/core';

export enum USER_PREFERENCES {
  ShowPortfolioFeedbackDetails = 1,
  ShowValueHistory = 2,
  ShowAccountSummaryDetails = 3,
  ShowTypeSummaryDetails = 4,
  ShowAnalytics = 5,
  ShowStockUnitChange = 6,
}

@Injectable({
  providedIn: 'root'
})

export class PreferencesService {

  constructor() { }

  getPreference(preference: USER_PREFERENCES | string): string | undefined {
    let preferences = JSON.parse(localStorage.getItem('user_preferences') ?? "{}");

    if(!preferences) {
      return undefined;
    }

    if(!preferences[preference]) {
      return undefined;
    }

    return preferences[preference];
  }

  setPreference(preference: USER_PREFERENCES | string, value: string): void {
    let preferences = JSON.parse(localStorage.getItem('user_preferences') ?? "{}");

    if(!preferences) {
      localStorage.setItem('user_preferences', JSON.stringify({preference: value}));
      return;
    }

    preferences[preference] = value;
    localStorage.setItem('user_preferences', JSON.stringify(preferences));
  }
}
