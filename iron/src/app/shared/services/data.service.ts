import { Injectable } from '@angular/core';
import { Asset, AssetType, AssetValue } from '../constants/constants';
import { BehaviorSubject, Observable, delay, map, tap } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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

  public getActiveAssets$(loadingIndicator: BehaviorSubject<boolean> | null = null): Observable<Asset[]> {
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
    if(loadingIndicator) {
      loadingIndicator.next(true);
    }

    return this.httpPost("getAsset", {assetId: assetId}).pipe(
      map((data: any) => {
        if(loadingIndicator) {
          loadingIndicator.next(false);
        }
        return data?.asset ?? {} as Asset;
      })
    )
  }

  public getHistoricalNetWorth$(assetType: AssetType | null = null, loadingIndicator: BehaviorSubject<boolean> | null = null): Observable<AssetValue[]> {
    if(loadingIndicator) {
      loadingIndicator.next(true);
    }

    return this.httpPost("getHistoricalNetWorth", assetType ? { assetType: assetType } : {}).pipe(
      map((data: any) => {
        if(loadingIndicator) {
          loadingIndicator.next(false);
        }
        return data?.user?.netWorths ?? [] as AssetValue[];
      })
    );
  }

  public getCurrentNetWorth$(assetType: AssetType | null = null, loadingIndicator: BehaviorSubject<boolean> | null = null): Observable<number> {
    if(loadingIndicator) {
      loadingIndicator.next(true);
    }

    return this.httpPost("getHistoricalNetWorth", assetType ? { assetType: assetType } : {}).pipe(
      map((data: any) => {
        if(loadingIndicator) {
          loadingIndicator.next(false);
        }
        return data?.user?.curNetWorth ?? 0;
      })
    );
  }

  public putAsset$(asset: Asset, loadingIndicator: BehaviorSubject<boolean> | null = null): Observable<Asset> {
    if(loadingIndicator) {
      loadingIndicator.next(true);
    }

    return this.httpPost("putAsset", {asset: asset}).pipe(
      map((data: any) => {
        if(loadingIndicator) {
          loadingIndicator.next(false);
        }
        this.dataChanged$.next(true);
        return data?.asset ?? {} as Asset;
      })
    )
  }

  public archiveAsset$(assetId: string, loadingIndicator: BehaviorSubject<boolean> | null = null): Observable<Asset> {
    if(loadingIndicator) {
      loadingIndicator.next(true);
    }

    return this.httpPost("archiveAsset", {assetId: assetId}).pipe(
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
    return this.getActiveAssets$()
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
    return this.httpPost('getAssetsByUser')
    .pipe(
      map((data: any) => {
        if (loadingIndicator) {
          loadingIndicator.next(false);
        }
        return data?.assets as Asset[] ?? []
      }),
    )
  }

  private httpPost(endpoint: string, params: any = {}): Observable<any> {
    return this.httpClient.post(
      "https://83ulpu3ica.execute-api.us-west-2.amazonaws.com/Stage/" + endpoint,
      {
        sessionToken: this.authService.getSessionToken(),
        ...params
      },
      {
        headers: {'Content-Type': 'application/json'},
      }
    ).pipe(
      tap(({
        next: () => {},
        error: (err: HttpErrorResponse) => {
          if(err.error?.error?.includes("No user found with id")) {
            this.authService.signOut();
          }
        }
      }))
    )
  }
}