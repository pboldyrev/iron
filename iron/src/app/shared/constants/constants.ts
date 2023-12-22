export const REGEX = {
  EMAIL: new RegExp(/^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+)+$/),
  PASSWORD: new RegExp('^.{8,}$'),
  TEXT: new RegExp('^.+$'),
  NUMBER: new RegExp('^([0-9]*\.)?[0-9]+$'),
  PHONE: new RegExp('^[1-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$'),
  INTEGER: new RegExp('^[1-9]+[0-9]*$'),
  DATE: new RegExp('^[0-9]{4,}-[0-9]{2,}-[0-9]{2,}$'),
  NOT_REQUIRED: new RegExp(''),
};

export type AssetValue = {
  timestamp?: number,
  value?: number,
}

export type NetWorthValue = {
  timestamp?: number,
  netWorth?: number,
}


export type VehicleCustomAttributes = {
  nickName?: string,
  vin?: string,
  make?: string,
  model?: string,
  year?: number,
  mileage?: number,
  appreciationRate?: number,
}

export type BaseAsset = {
  assetId?: string,
  userId?: string,
  assetName?: string,
  assetType?: string,
  timeCreated?: number,
  account?: string,
  units?: number,
  totalValues?: AssetValue[],
  curValue?: number,
  initValue?: number,
  isArchived?: boolean,
}

export type Asset = BaseAsset & VehicleCustomAttributes;

export type GetAssetsResponse = {
  assets: Asset[]
}

export type ArchiveAssetResponse = {
  asset: Asset
}

export enum AssetType {
  Stock = 'stock',
  Vehicle = 'vehicle',
  CD = 'cd',
  Savings = 'savings',
  Custom = 'custom',
}

export const TypeToDisplayName = {
  stock: "Stock",
  vehicle: "Vehicle",
  cd: "CD",
  savings: "Savings",
  custom: "Custom",
}

export type ValueChange = {
  type: string;
  value: number;
  percent: number;
}

export const MIXPANEL = {
  LOGIN_ENTERED_PHONE: "Login|Event|EnteredPhone",
  LOGIN_ENTERED_CODE: "Login|Event|EnteredCode",
  LOGIN_PHONE_FAILED: "Login|Error|FailedPhone",
  LOGIN_CODE_FAILED: "Login|Error|FailedCode",
  HTTP_RESPONSE_ERROR: "HTTP|Error|ResponseError",
  HTTP_CREATED_ASSET: "HTTP|Event|AssetCreated",
}