import { AssetType } from "src/app/shared/constants/constants"

export const AssetToNameMap = {
    [AssetType.Vehicle]: "Vehicle",
    [AssetType.Stock]: "Stock / ETF",
    [AssetType.Cash]: "Cash",
    [AssetType.Loan]: "Loan",
}