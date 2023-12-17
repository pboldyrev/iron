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
  timestamp?: string,
  value?: string,
}

export type VehicleCustomAttributes = {
  nickName?: string,
  vehicleVin?: string,
  vehicleMake?: string,
  vehicleModel?: string,
  vehicleYear?: number,
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
  curValue?: string,
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
  HYSA = 'hysa',
  Custom = 'custom',
}