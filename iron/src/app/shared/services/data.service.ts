import { Injectable } from '@angular/core';
import { Asset, AssetType, AssetValue, MIXPANEL } from '../constants/constants';
import { BehaviorSubject, Observable, combineLatest, delay, map, mergeMap, take, tap } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { MixpanelService } from './mixpanel.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public dataChanged$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private toastService: ToastService,
    private mixpanelService: MixpanelService,
  ) {}

  /*
   *  NEED TO BE REFETCHED AFTER DATA CHANGES
   */

  public getAssetValues$(assetId: string, loadingIndicator: BehaviorSubject<boolean> | null = null): Observable<AssetValue[]> {
    if(loadingIndicator) {
      loadingIndicator.next(true);
    }

    const options = {
      assetId: assetId, 
    };

    return this.dataChanged$.pipe(
      mergeMap(() => {
        return this.httpPost("getAssetValues", options)
      }),
      map((data: any) => {
        if(loadingIndicator) {
          loadingIndicator.next(false);
        }
        return data?.totalValues ?? [] as AssetValue[];
      })
    );
  }

  public getAssetById$(assetId: string, loadingIndicator: BehaviorSubject<boolean> | null = null): Observable<Asset> {
    if(loadingIndicator) {
      loadingIndicator.next(true);
    }

    const options = {
      assetId: assetId, 
    };

    return this.dataChanged$.pipe(
      mergeMap(() => {
        return this.httpPost("getAsset", options)
      }),
      map((data: any) => {
        if(loadingIndicator) {
          loadingIndicator.next(false);
        }
        return data?.asset ?? {} as Asset;
      })
    );
  }

  /*
   *  NEED TO MARK DATA AS STALE WHEN CALLED
   */

  public putAssetValue$(assetId: string, newValue: AssetValue, loadingIndicator: BehaviorSubject<boolean> | null = null): Observable<string> {
    if (loadingIndicator) {
      loadingIndicator.next(true);
    }

    const options = {
      assetId: assetId, 
      timestamp: newValue.timestamp, 
      value: newValue.value
    };

    return this.httpPost("putAssetValue", options)
    .pipe(
      map((data: any) => {
        if(loadingIndicator) {
          loadingIndicator.next(false);
        }

        this.dataChanged$.next(true);

        return data?.assetValue?.timestamp ?? {} as string;
      })
    );
  }

  public deleteAssetValue$(assetId: string, timestamp: number, loadingIndicator: BehaviorSubject<boolean> | null = null): Observable<string> {
    if (loadingIndicator) {
      loadingIndicator.next(true);
    }

    const options = {
      assetId: assetId, 
      timestamp: timestamp, 
    };

    return this.httpPost("removeAssetValue", options).pipe(
      map((data: any) => {
        if(loadingIndicator) {
          loadingIndicator.next(false);
        }

        this.dataChanged$.next(true);

        return data?.assetId ?? {} as string;
      })
    )
  }

  public getAssets$(includeArchived: boolean = false, loadingIndicator: BehaviorSubject<boolean> | null = null): Observable<Asset[]> {
    if (loadingIndicator) {
      loadingIndicator.next(true);
    }
    return this.fetchUserAssets$().pipe(
      map((assets: Asset[]) => {
        if (loadingIndicator) {
          loadingIndicator.next(false);
        }
        return assets.filter((asset) => !asset.isArchived || includeArchived);
      })
    );
  }

  public getHistoricalNetWorth$(assetType: AssetType | null = null, loadingIndicator: BehaviorSubject<boolean> | null = null): Observable<AssetValue[]> {
    if(loadingIndicator) {
      loadingIndicator.next(true);
    }

    return combineLatest([
      this.dataChanged$,
      this.httpPost("getHistoricalNetWorth", assetType ? { assetType: assetType } : {})
    ]).pipe(
      map(([refresh, data]) => {
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

    return this.httpPost("getUserNetWorths", assetType ? { assetType: assetType } : {}).pipe(
      map((data: any) => {
        if(loadingIndicator) {
          loadingIndicator.next(false);
        }
        return data?.netWorth ?? 0;
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
          if(err.error?.error?.includes("No user found with sessionToken")) {
            this.authService.signOut();
            this.toastService.showToast("Your session has expired, please log in again", FeedbackType.ERROR);
          }
          this.mixpanelService.track(
            MIXPANEL.HTTP_RESPONSE_ERROR,
            {
              endpoint: endpoint,
              error: err
            }
          );
        }
      }))
    )
  }
}