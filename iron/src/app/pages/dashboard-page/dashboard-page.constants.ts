import { AssetTableColumn } from "src/app/pages/dashboard-page/asset-table/asset-table.component";

export const ASSET_TABLE_COLS_COLLAPSED: AssetTableColumn[] = ['select', 'asset', 'curValue', 'edit'];
export const ASSET_TABLE_COLS_EXPANDED: AssetTableColumn[] = ['select', 'type', 'asset', 'curValue', 'units', 'edit'];
export const ASSET_TABLE_FOOTER_COLS: AssetTableColumn[] = ['asset', 'curValue'];