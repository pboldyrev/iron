import { Injectable } from '@angular/core';
import { Asset, AssetValue } from '../constants/constants';
import { BehaviorSubject, Observable, Subject, delay, map, max, of } from 'rxjs';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public dataChanged$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
  ) {
  }

  public getUserAssets$(userId: string): Observable<Asset[]> {
    const assets = localStorage.getItem("userAssets");
    if(assets){
      return of(JSON.parse(assets)).pipe(delay(500));
    } else {
      return of([]);
    }
  }

  public getAssetById$(userId: string, assetId: string): Observable<Asset | null> {
    return this.getUserAssets$(userId)
    .pipe(
      map((assets: Asset[]) => {
        let matchedAsset = null;
        assets.forEach((asset) => {
          if(asset.id === assetId) {
            matchedAsset = asset;
          }
        });
        return matchedAsset;
      })
    );
  }

  public addAsset$(userId: string, asset: Asset): Observable<string | undefined> {
    asset.id = uuid();

    if(!asset.accountName) {
      asset.accountName = "Other";
    }

    return this.getUserAssets$(userId).pipe(
      map((assets: Asset[]) => {
        assets.push(asset);
        localStorage.setItem("userAssets", JSON.stringify(assets));
        this.dataChanged$.next(true);
        return asset.id;
      })
    );
  }

  public archiveAsset$(userId: string, assetToArchive: Asset): Observable<boolean> {
    return this.getUserAssets$(userId)
    .pipe(
      map((assets: Asset[]) => {
        const updatedAssets = assets.filter(asset => asset.id !== assetToArchive.id);
        try {
          localStorage.setItem("userAssets", JSON.stringify(updatedAssets));
          this.dataChanged$.next(true);
          return true;
        } catch (error: any) {
          return false;
        }
      })
    );
  }

  public appendAssetHistory$(userId: string, assetId: string,  valueHistory: AssetValue[]) {
    return this.getUserAssets$(userId)
    .pipe(
      map((assets: Asset[]) => {
        assets.forEach((asset) => {
          if(asset.id === assetId) {
            asset.historicalValues = [
              ...asset.historicalValues ?? [],
              ...valueHistory
            ];
            this.setAssetInitAndCurValues(asset);
          }
        });
        localStorage.setItem("userAssets", JSON.stringify(assets));
        this.dataChanged$.next(true);
      })
    )
  }

  public deleteAssetHistoryEntry$(userId: string, assetId: string,  entryToDelete: AssetValue) {
    return this.getUserAssets$(userId)
    .pipe(
      map((assets: Asset[]) => {
        assets.forEach((asset) => {
          if(asset.id === assetId) {
            asset.historicalValues = asset.historicalValues?.filter((asset) => asset.date !== entryToDelete.date);
            this.setAssetInitAndCurValues(asset);
          }
        });
        localStorage.setItem("userAssets", JSON.stringify(assets));
        this.dataChanged$.next(true);
      })
    )
  }

  private setAssetInitAndCurValues(asset: Asset): void {
    if(!asset.historicalValues || asset.historicalValues.length === 0) {
      return;
    }

    let minDate = new Date(asset.historicalValues[0].date);
    let maxDate = new Date(asset.historicalValues[0].date);
    asset.historicalValues?.forEach((value: AssetValue) => {
      const date = new Date(value.date);

      if(date <= minDate) {
        minDate = date;
        asset.initValue = value.value;
      }

      if(date >= maxDate) {
        maxDate = date;
        asset.curValue = value.value;
      }
    });
  }
}