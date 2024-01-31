export const REGEX = {
  EMAIL: new RegExp(/^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+)+$/),
  PASSWORD: new RegExp('^.{8,}$'),
  TEXT: new RegExp('^.+$'),
  NUMBER: new RegExp('^([0-9]*\.)?[0-9]+$'),
  CURRENCY: new RegExp('^[-]?[$]?([0-9]*\.)?[0-9]+$'),
  VIN: new RegExp('[(A-H|J-N|P|R-Z|0-9)]{17,}'),
  PHONE: new RegExp('^[1-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$'),
  INTEGER: new RegExp('^[1-9]+[0-9]*$'),
  DATE: new RegExp('^.+$'),
  NOT_REQUIRED: new RegExp(''),
  PERCENT: new RegExp('^([0-9]*\.)?[0-9]+%$'),
};

export type AssetValue = {
  timestamp: number,
  totalValue: number,
  units: number,
}

export type VehicleAttributes = {
  nickName?: string,
  vin?: string,
  mileage?: number,
  initTotalValue?: number,
  initTimestamp?: number,
}

export type StockAttributes = {
  ticker?: string;
  initUnits?: number,
  initTimestamp?: number,
}

export type CashAttributes = {
  appreciationRate?: number;
}

export type BaseAsset = {
  assetId?: string,
  userId?: string,
  assetName?: string,
  assetType?: AssetType,
  timeCreated?: number,
  account?: string,
  curTotalValue?: number,
  curUnits?: number,
  isArchived?: boolean,
}

export type Asset = BaseAsset & VehicleAttributes & StockAttributes & CashAttributes;

export enum AssetType {
  Stock = 'stock',
  Vehicle = 'vehicle',
  Cash = 'cash',
}

export const TypeToDisplayName = {
  stock: "Stock",
  vehicle: "Vehicle",
  cash: "Cash",
}

export type ValueChange = {
  type: string;
  value: number;
  percent: number;
}

export const ROOT_URL = "/dashboard";

export const ANALYTICS = {
  LOGIN_ENTERED_PHONE: "Login|Event|EnteredPhone",
  LOGIN_ENTERED_CODE: "Login|Event|EnteredCode",
  LOGIN_PHONE_FAILED: "Login|Error|FailedPhone",
  LOGIN_CODE_FAILED: "Login|Error|FailedCode",
  HTTP_RESPONSE_ERROR: "HTTP|Error|ResponseError",
  HTTP_CREATED_ASSET: "HTTP|Event|AssetCreated",
}