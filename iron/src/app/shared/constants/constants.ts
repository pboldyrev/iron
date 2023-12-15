export const REGEX = {
  EMAIL: new RegExp(/^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+)+$/),
  PASSWORD: new RegExp('^.{8,}$'),
  TEXT: new RegExp('^.+$'),
  NUMBER: new RegExp('^([0-9]*\.)?[0-9]+$'),
  INTEGER: new RegExp('^[1-9]+[0-9]*$'),
  NOT_REQUIRED: new RegExp(''),
};

export type Asset = {
  assetName: string,
  lastUpdated: number,
  accountName?: string,
  id?: string,
  type?: string,
  numUnits?: number,
  curValue?: number,
  initValue?: number,
}

export enum AssetType {
  Stock = 'stock',
  Vehicle = 'vehicle',
  CD = 'cd',
  HYSA = 'hysa',
  Custom = 'custom',
}