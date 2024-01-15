import { Injectable } from '@angular/core';

export enum USER_PREFERENCES {
  ShowPortfolioFeedbackDetails = 1,
}

@Injectable({
  providedIn: 'root'
})

export class PreferencesService {

  constructor() { }

  getPreference(preference: USER_PREFERENCES): string | undefined {
    let preferences = JSON.parse(localStorage.getItem('user_preferences') ?? "{}");

    if(!preferences) {
      return undefined;
    }

    if(!preferences[preference]) {
      return undefined;
    }

    return preferences[preference];
  }

  setPreference(preference: USER_PREFERENCES, value: string): void {
    let preferences = JSON.parse(localStorage.getItem('user_preferences') ?? "{}");

    if(!preferences) {
      localStorage.setItem('user_preferences', JSON.stringify({preference: value}));
      return;
    }

    preferences[preference] = value;
    localStorage.setItem('user_preferences', JSON.stringify(preferences));
  }
}
