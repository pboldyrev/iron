export const REGEX = {
  EMAIL: new RegExp(/^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+)+$/),
  PASSWORD: new RegExp('^.{8,}$'),
  TEXT: new RegExp('^.+$'),
  NUMBER: new RegExp('^([0-9]*\.)?[0-9]+$'),
  INTEGER: new RegExp('^[1-9]+[0-9]*$'),
  DATE: new RegExp('^[0-9]{4,}-[0-9]{2,}-[0-9]{2,}$'),
  NOT_REQUIRED: new RegExp(''),
};

export type AssetValue = {
  date?: string,
  value?: number,
}

export type Asset = {
  assetName?: string,
  lastUpdated?: number,
  type?: string,
  accountName?: string,
  id?: string,
  numUnits?: number,
  curValue?: number,
  initValue?: number,
  historicalValues?: AssetValue[],
}

export enum AssetType {
  Stock = 'Stock',
  Vehicle = 'Vehicle',
  CD = 'CD',
  HYSA = 'HYSA',
  Custom = 'Custom',
}