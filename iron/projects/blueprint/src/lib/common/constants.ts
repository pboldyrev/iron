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
  | 'stock'
  | 'vehicle'
  | 'hysa'
  | 'custom'
  | 'cd'
  | 'spinner'
  | 'trash'
  | 'backArrow'
  | 'question'
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
  chevronUp: 'heroArrowTrendingUp',
  chevronDown: 'heroArrowTrendingDown',
  kebab: 'octKebabHorizontal',
  lock: 'octLock',
  vehicle: 'heroRocketLaunch',
  stock: 'heroBuildingLibrary',
  hysa: 'heroBanknotes',
  custom: 'heroBanknotes',
  spinner: 'heroArrowPath',
  cd: 'heroClock',
  trash: 'heroTrash',
  backArrow: 'heroArrowLeft',
  question: 'octQuestion'
};
