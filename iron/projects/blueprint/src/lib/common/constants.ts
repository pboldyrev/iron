export enum FeedbackType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
}

export type BluSelectOption = {
  id: string,
  text: string,
  selected?: boolean,
}

export type BluIconName =
  | 'check'
  | 'info'
  | 'xCircle'
  | 'home'
  | 'gear'
  | 'graph'
  | 'signIn'
  | 'signOut'
  | 'x'
  | 'threeBars'
  | 'plus'
  | 'chevronUp'
  | 'chevronDown'
  | 'kebab'
  | 'lock'
  | 'bank'
  | 'rocket'
  | 'banknote'
  | 'clock'
  | 'spinner'
  | 'plus';

export const BluToIconMap = {
  check: 'octCheck',
  info: 'octInfo',
  xCircle: 'octXCircle',
  home: 'octHome',
  gear: 'octGear',
  graph: 'octGraph',
  signIn: 'octSignIn',
  signOut: 'octSignOut',
  x: 'octX',
  threeBars: 'octThreeBars',
  plus: 'octPlus',
  chevronUp: 'heroChevronUp',
  chevronDown: 'heroChevronDown',
  kebab: 'octKebabHorizontal',
  lock: 'octLock',
  rocket: 'heroRocketLaunch',
  bank: 'heroBuildingLibrary',
  banknote: 'heroBanknotes',
  spinner: 'octSync',
  clock: 'heroClock',
};
