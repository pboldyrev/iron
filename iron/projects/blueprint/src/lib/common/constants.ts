export enum FeedbackType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
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
  | 'savings'
  | 'cash'
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
  savings: 'heroBanknotes',
  cash: 'heroCurrencyDollar',
  spinner: 'heroArrowPath',
  cd: 'heroClock',
  trash: 'heroTrash',
  backArrow: 'heroArrowLeft',
  question: 'octQuestion'
};
