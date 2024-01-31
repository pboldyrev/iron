import { AssetType } from "src/app/shared/constants/constants"

export const AssetToTitleMap = {
    [AssetType.Stock]: 'Add a stock or ETF',
    [AssetType.Vehicle]: 'Add a vehicle',
    [AssetType.Cash]: 'Add a cash asset',
    [AssetType.Loan]: 'Add a loan',
}