import { Injectable } from '@angular/core';
import { Asset, AssetType, AssetValue, MIXPANEL, NetWorthValue } from '../constants/constants';
import { BehaviorSubject, Observable, combineLatest, delay, map, mergeMap, take, tap } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { MixpanelService } from './mixpanel.service';
import { environment } from 'src/environments';

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

  public getNetWorthValues$(assetType: AssetType | null = null, loadingIndicator: BehaviorSubject<boolean> | null = null): Observable<NetWorthValue[]> {
    if(loadingIndicator) {
      loadingIndicator.next(true);
    }

    let options: any;

    if(assetType) {
      options = {
        assetType: assetType, 
      };
    } else {
      options = {}
    }

    return this.dataChanged$.pipe(
      mergeMap(() => {
        return this.httpPost("getUserNetWorths", options)
      }),
      map((data: any) => {
        return data?.netWorths ?? [];
      }),
      tap({
        next: () => {
          if (loadingIndicator) {
            loadingIndicator.next(false);
          }
        },
        error: () => {
          if (loadingIndicator) {
            loadingIndicator.next(false);
          }
        }
      })
    );
  }

  public getAssets$(includeArchived: boolean = false, loadingIndicator: BehaviorSubject<boolean> | null = null): Observable<Asset[]> {
    if (loadingIndicator) {
      loadingIndicator.next(true);
    }

    return this.dataChanged$.pipe(
      mergeMap(() => {
        return this.fetchUserAssets$()
      }),
      map((assets: Asset[]) => {
        return assets.filter((asset) => !asset.isArchived || includeArchived);
      }),
      tap({
        next: () => {
          if (loadingIndicator) {
            loadingIndicator.next(false);
          }
        },
        error: () => {
          if (loadingIndicator) {
            loadingIndicator.next(false);
          }
        }
      })
    );
  }

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
        return data?.totalValues ?? [] as AssetValue[];
      }),
      tap({
        next: () => {
          if (loadingIndicator) {
            loadingIndicator.next(false);
          }
        },
        error: () => {
          if (loadingIndicator) {
            loadingIndicator.next(false);
          }
        }
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
        return data?.asset ?? {} as Asset;
      }),
      tap({
        next: () => {
          if (loadingIndicator) {
            loadingIndicator.next(false);
          }
        },
        error: () => {
          if (loadingIndicator) {
            loadingIndicator.next(false);
          }
        }
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
        this.dataChanged$.next(true);

        return data?.assetValue?.timestamp ?? {} as string;
      }),
      tap({
        next: () => {
          if (loadingIndicator) {
            loadingIndicator.next(false);
          }
        },
        error: () => {
          if (loadingIndicator) {
            loadingIndicator.next(false);
          }
        }
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
        this.dataChanged$.next(true);

        return data?.assetId ?? {} as string;
      }),
      tap({
        next: () => {
          if (loadingIndicator) {
            loadingIndicator.next(false);
          }
        },
        error: () => {
          if (loadingIndicator) {
            loadingIndicator.next(false);
          }
        }
      })
    )
  }

  public putAsset$(asset: Asset, loadingIndicator: BehaviorSubject<boolean> | null = null): Observable<Asset> {
    if(loadingIndicator) {
      loadingIndicator.next(true);
    }

    return this.httpPost("putAsset", {asset: asset}).pipe(
      map((data: any) => {
        this.dataChanged$.next(true);
        return data?.asset ?? {} as Asset;
      }),
      tap({
        next: (asset: Asset) => {
          if (loadingIndicator) {
            loadingIndicator.next(false);
          }
          this.mixpanelService.track(
            MIXPANEL.HTTP_CREATED_ASSET,
            {
              asset: asset,
            }
          );
        },
        error: () => {
          if (loadingIndicator) {
            loadingIndicator.next(false);
          }
        }
      })
    )
  }

  public archiveAsset$(assetId: string, loadingIndicator: BehaviorSubject<boolean> | null = null): Observable<Asset> {
    if(loadingIndicator) {
      loadingIndicator.next(true);
    }

    return this.httpPost("archiveAsset", {assetId: assetId}).pipe(
      map((data: any) => {
        this.dataChanged$.next(true);
        return data?.asset ?? {} as Asset;
      }),
      tap({
        next: () => {
          if (loadingIndicator) {
            loadingIndicator.next(false);
          }
        },
        error: () => {
          if (loadingIndicator) {
            loadingIndicator.next(false);
          }
        }
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
        return data?.assets as Asset[] ?? []
      }),
      tap({
        next: () => {
          if (loadingIndicator) {
            loadingIndicator.next(false);
          }
        },
        error: () => {
          if (loadingIndicator) {
            loadingIndicator.next(false);
          }
        }
      })
    )
  }

  private httpPost(endpoint: string, params: any = {}): Observable<any> {
    return this.httpClient.post(
      environment.berry + endpoint,
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
          } else {
            this.toastService.showToast("Something went wrong, please try again", FeedbackType.ERROR);
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