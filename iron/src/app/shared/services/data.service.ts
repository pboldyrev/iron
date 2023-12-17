import { Injectable } from '@angular/core';
import { ArchiveAssetResponse, Asset, AssetValue } from '../constants/constants';
import { BehaviorSubject, Observable, delay, map, mergeMap, of, tap } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public dataChanged$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
  ) {}

  public getActiveAssets(loadingIndicator: BehaviorSubject<boolean> | null = null): Observable<Asset[]> {
    if (loadingIndicator) {
      loadingIndicator.next(true);
    }
    return this.fetchUserAssets$().pipe(
      map((assets: Asset[]) => {
        if (loadingIndicator) {
          loadingIndicator.next(false);
        }
        return assets.filter((asset: Asset) => !asset.isArchived);
      })
    );
  }

  public getInactiveAssets(loadingIndicator: BehaviorSubject<boolean> | null = null): Observable<Asset[]> {
    if (loadingIndicator) {
      loadingIndicator.next(true);
    }
    return this.fetchUserAssets$().pipe(
      map((assets: Asset[]) => {
        if (loadingIndicator) {
          loadingIndicator.next(false);
        }
        return assets.filter((asset: Asset) => !asset.isArchived);
      })
    );
  }

  public getAllAssets$(loadingIndicator: BehaviorSubject<boolean> | null = null): Observable<Asset[]> {
    if (loadingIndicator) {
      loadingIndicator.next(true);
    }
    return this.fetchUserAssets$().pipe(
      map((assets: Asset[]) => {
        if (loadingIndicator) {
          loadingIndicator.next(false);
        }
        return assets;
      })
    );
  }

  public getAssetById$(assetId: string, loadingIndicator: BehaviorSubject<boolean> | null = null): Observable<Asset> {
    return this.getActiveAssets(loadingIndicator)
    .pipe(
      map((assets: Asset[]) => {
        let matchedAsset: Asset = {};
        assets.forEach((asset: Asset) => {
          if(asset.assetId === assetId) {
            matchedAsset = asset;
          }
        });
        return matchedAsset;
      })
    );
  }

  public addAsset$(asset: Asset): Observable<string | undefined> {
    asset.assetId = uuid();

    if(!asset.account) {
      asset.account = "Other";
    }

    return this.getActiveAssets().pipe(
      map((assets: Asset[]) => {
        assets.push(asset);
        localStorage.setItem("userAssets", JSON.stringify(assets));
        return asset.assetId;
      }),
      delay(500)
    );
  }

  public archiveAsset$(assetId: string, loadingIndicator: BehaviorSubject<boolean> | null = null): Observable<Asset> {
    if(loadingIndicator) {
      loadingIndicator.next(true);
    }

    return this.httpClient.post(
      "https://83ulpu3ica.execute-api.us-west-2.amazonaws.com/Stage/archiveAsset",
      {
        sessionToken: this.authService.getSessionToken(),
        assetId: assetId,
      },
      {
        headers: {'Content-Type': 'application/json'},
      }
    ).pipe(
      map((data: any) => {
        if(loadingIndicator) {
          loadingIndicator.next(false);
        }
        this.dataChanged$.next(true);
        return data?.asset ?? {} as Asset;
      })
    )
  }

  public appendAssetHistory$(assetId: string,  assetValue: AssetValue) {
    return this.httpClient.post(
      "https://83ulpu3ica.execute-api.us-west-2.amazonaws.com/Stage/getAssetsByUser",
      {
        sessionToken: this.authService.getSessionToken(),
      },
      {
        headers: {'Content-Type': 'application/json'},
      }
    )
  }

  public deleteAssetHistoryEntry$(assetId: string,  entryToDelete: AssetValue) {
    return this.getActiveAssets()
    .pipe(
      map((assets: Asset[]) => {
        assets.forEach((asset) => {
          if(asset.assetId === assetId) {
            asset.totalValues = asset.totalValues?.filter((asset: AssetValue) => asset.timestamp !== entryToDelete.timestamp);
          }
        });
        localStorage.setItem("userAssets", JSON.stringify(assets));
      }),
      delay(500)
    )
  }

  private fetchUserAssets$(loadingIndicator: BehaviorSubject<boolean> | null = null): Observable<Asset[]> {
    if (loadingIndicator) {
      loadingIndicator.next(true);
    }
    return this.httpClient.post(
      "https://83ulpu3ica.execute-api.us-west-2.amazonaws.com/Stage/getAssetsByUser",
      {
        sessionToken: this.authService.getSessionToken(),
      },
      {
        headers: {'Content-Type': 'application/json'},
      }
    ).pipe(
      map((data: any) => {
        if (loadingIndicator) {
          loadingIndicator.next(false);
        }
        return data?.assets as Asset[] ?? []
      }),
    )
  }
}