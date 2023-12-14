import { Injectable } from '@angular/core';
import { InputType } from '../interfaces/interfaces';
import { REGEX } from '../constants/constants';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';

@Injectable({
  providedIn: 'root',
})
export class RegexService {
  constructor() {}

  public isValidString(value: string, type: InputType) {
    return !!REGEX[type].exec(value);
  }
}
