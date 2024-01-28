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
  | 'menu'
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
  | 'collapse'
  | 'show'
  | 'help'
  | 'lucideCar'
  | 'plus'
  | 'heroDocumentArrowUp'
  | 'selectFile'
  | string;

export const BluToIconMap: {[index: string]:any} = {
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
  vehicle: 'lucideCar',
  stock: 'heroBuildingLibrary',
  savings: 'heroBanknotes',
  cash: 'heroCurrencyDollar',
  spinner: 'heroArrowPath',
  cd: 'heroClock',
  trash: 'heroTrash',
  backArrow: 'heroArrowLeft',
  question: 'octQuestion',
  collapse: 'heroEyeSlash',
  show: 'heroEye',
  help: 'heroChatBubbleOvalLeft',
  upload: 'heroDocumentArrowUp',
  selectFile: 'circumFileOn',
  menu: 'ionMenuOutline',
};
