import { BluIconName } from 'projects/blueprint/src/lib/common/constants';

export interface SidebarOption {
  icon: BluIconName;
  name: string;
  link: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
}

// Must have matching regex in constants file with same key
export type InputType = 'TEXT' | 'EMAIL' | 'PASSWORD' | 'NUMBER' | 'INTEGER' | 'DATE' | 'PHONE' | 'VIN' | 'CURRENCY' | 'PERCENT';
