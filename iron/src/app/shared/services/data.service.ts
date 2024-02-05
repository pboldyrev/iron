import { Injectable } from '@angular/core';
import { Asset, AssetType, AssetValue, ANALYTICS } from '../constants/constants';
import { BehaviorSubject, Observable, combineLatest, concat, delay, map, merge, mergeMap, of, take, tap, throwError, toArray } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { AnalyticsService } from './analytics.service';
import { environment } from 'src/environments';
import { PlanName } from 'src/app/pages/settings-page/billing/billing.constants';

export const BATCH_SIZE = 9;

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public dataChanged$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private toastService: ToastService,
    private analyticsService: AnalyticsService,
  ) {}

  /*
   *  NEED TO BE REFETCHED AFTER DATA CHANGES
   */

  public getNetWorthValues$(assetType: AssetType | null = null, loadingIndicator: BehaviorSubject<boolean> | null = null): Observable<AssetValue[]> {
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
        if(loadingIndicator) {
          loadingIndicator.next(true);
        }

        return this.httpPost("getUserNetWorths", options)
      }),
      map((data: any) => {
        let totalValues = (data?.netWorths ?? []).map((netWorthValue: any) => {
          return {
            timestamp: netWorthValue.timestamp,
            totalValue: netWorthValue.netWorth,
            units: -1,
          } as AssetValue
        });
        return totalValues;
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
          this.analyticsService.track("Failed to get user networth values", { options: options });
        }
      })
    );
  }

  public getAssets$(loadingIndicator: BehaviorSubject<boolean> | null = null): Observable<Asset[]> {
    return this.dataChanged$.pipe(
      mergeMap(() => {
        if(loadingIndicator) {
          loadingIndicator.next(true);
        }

        return this.fetchUserAssets$()
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
          this.analyticsService.track("Failed to get assets for user");
        }
      })
    );
  }

  public getAssetValues$(assetId: string, loadingIndicator: BehaviorSubject<boolean> | null = null): Observable<AssetValue[]> {
    const options = {
      assetId: assetId, 
    };

    return this.dataChanged$.pipe(
      mergeMap(() => {
        if(loadingIndicator) {
          loadingIndicator.next(true);
        }

        return this.httpPost("getAssetValues", options)
      }),
      map((data: any) => {
        let totalValues = data?.totalValues ?? [];
        return totalValues;
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
          this.analyticsService.track("Failed to get asset values", { assetId: assetId });
        }
      })
    );
  }

  public getAssetById$(assetId: string, loadingIndicator: BehaviorSubject<boolean> | null = null): Observable<Asset> {
    const options = {
      assetId: assetId, 
    };

    return this.dataChanged$.pipe(
      mergeMap(() => {
        if(loadingIndicator) {
          loadingIndicator.next(true);
        }

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
          this.analyticsService.track("Failed to get asset by ID", { assetId: assetId });
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
      totalValue: newValue.totalValue,
      units: newValue.units,
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
          this.analyticsService.track("Failed to put asset value", { assetId: assetId, options: options });
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
          this.analyticsService.track("Failed to delete asset value", { assetId: assetId, options: options });
        }
      })
    )
  }

  public putAssets$(assets: Asset[], tracker$: Observable<boolean>[] = []): Observable<Asset[]> {
    let assetsToImport$ = [] as Observable<Asset>[];

    assets.forEach((asset: Asset) => {
      let importObservable$ = new BehaviorSubject<boolean>(false);
      tracker$.push(importObservable$);
      assetsToImport$.push(this.putAsset$
        (asset, 
        {
          timestamp: asset.initTimestamp ?? 0,
          totalValue: asset.initTotalValue ?? 0,
          units: asset.initUnits ?? 0, 
        }, 
        importObservable$, 
        false));
    });
    
    return this.batchAndExecute$(assetsToImport$).pipe(
      tap({
        error: () => {
          this.analyticsService.track("Failed to create multiple assets", { assets: assets });
        }
      })
    );
  }

  public putAsset$(asset: Asset, initialValue: AssetValue | null, loadingIndicator: BehaviorSubject<boolean> | null = null, updateData = true): Observable<Asset> {
    if(loadingIndicator) {
      loadingIndicator.next(true);
    }

    let assetPayload: any;

    if(initialValue) {
      assetPayload = {
        asset: asset,
        initAssetValue: initialValue,
      }
    } else {
      assetPayload = {
        asset: asset,
      }
    }

    return this.httpPost("putAsset", assetPayload).pipe(
      map((data: any) => {
        if(updateData) {
          this.dataChanged$.next(true);
        }
        return data?.asset ?? {} as Asset;
      }),
      tap({
        next: (asset: Asset) => {
          if (loadingIndicator) {
            loadingIndicator.next(false);
          }
          this.analyticsService.track(
            ANALYTICS.HTTP_CREATED_ASSET,
            {
              asset: asset,
            }
          );
        },
        error: () => {
          if (loadingIndicator) {
            loadingIndicator.next(false);
          }
          this.analyticsService.track("Failed to create asset", { assetPayload: assetPayload });
        }
      })
    )
  }

  public updateAsset$(asset: Asset, loadingIndicator: BehaviorSubject<boolean> | null = null): Observable<Asset> {
    if(loadingIndicator) {
      loadingIndicator.next(true);
    }

    return this.httpPost("updateAsset", {asset: asset}).pipe(
      map((data: any) => {
        this.dataChanged$.next(true);
        return data?.asset ?? {} as Asset;
      }),
      tap({
        next: (asset: Asset) => {
          if (loadingIndicator) {
            loadingIndicator.next(false);
          }
          this.analyticsService.track(
            ANALYTICS.HTTP_CREATED_ASSET,
            {
              asset: asset,
            }
          );
        },
        error: () => {
          if (loadingIndicator) {
            loadingIndicator.next(false);
          }
          this.analyticsService.track("Failed to update asset", { asset: asset });
        }
      })
    )
  }

  public deleteAssets$(assetIds: string[], tracker$: Observable<boolean>[] = []): Observable<Asset> {
    let assetsToDelete$ = [] as Observable<Asset>[];

    assetIds.forEach((id: string) => {
      let importObservable$ = new BehaviorSubject<boolean>(false);
      tracker$.push(importObservable$);
      assetsToDelete$.push(this.deleteAsset$(id, importObservable$, false));
    });
    
    return this.batchAndExecute$(assetsToDelete$)
    .pipe(
      tap({
        error: () => {
          this.analyticsService.track("Failed to bulk delete assets", { assetIds: assetIds });
        }
      })
    );
  }

  public deleteAsset$(assetId: string, loadingIndicator: BehaviorSubject<boolean> | null = null, updateData = true): Observable<Asset> {
    if(loadingIndicator) {
      loadingIndicator.next(true);
    }

    return this.httpPost("removeAsset", {assetId: assetId}).pipe(
      map((data: any) => {
        if(updateData) {
          this.dataChanged$.next(true);
        }
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
          this.analyticsService.track("Failed to delete asset", { assetId: assetId });
        }
      })
    )
  }

  public getUser$(loadingIndicator: BehaviorSubject<boolean> | null = null): Observable<Asset> {
    if(loadingIndicator) {
      loadingIndicator.next(true);
    }

    return this.httpPost("getUser").pipe(
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
          this.analyticsService.track("Failed to get user");
        }
      })
    )
  }

  public removeUser$(): Observable<void> {
    return this.httpPost("removeUser")
    .pipe(
      tap({
        error: () => {
          this.analyticsService.track("Failed to delete user");
        }
      })
    );
  }

  public createStripePortalSession$(): Observable<Asset> {
    const payload = {
      url: "https://finacle.app/settings",
    }

    return this.httpPost("createStripePortalSession", payload)
    .pipe(
      tap({
        error: () => {
          this.analyticsService.track("Failed to create stripe portal session", { payload: payload });
        }
      })
    );
  }

  public createStripeCheckoutSession$(planName: PlanName): Observable<Asset> {
    const payload = {
      plan: planName,
      successUrl: "https://finacle.app/success/" + planName,
      cancelUrl: "https://finacle.app/settings",
    }

    return this.httpPost("createStripeCheckoutSession", payload)
    .pipe(
      tap({
        error: () => {
          this.analyticsService.track("Failed to create stripe checkout session", { payload: payload });
        }
      })
    );
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
          this.analyticsService.track("Failed to fetch user assets");
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
          if(err.error?.error){
            if(err.error.error.includes("No user found")) {
              this.authService.signOut();
              this.toastService.showToast("Your session has expired, please log in again.", FeedbackType.ERROR);
              return;
            }
            this.toastService.showToast(err.error.error, FeedbackType.ERROR);
          } else {
            this.toastService.showToast("Something went wrong, please try again", FeedbackType.ERROR);
          }
          this.analyticsService.track(
            ANALYTICS.HTTP_RESPONSE_ERROR,
            {
              endpoint: endpoint,
              error: err
            }
          );
        }
      }))
    )
  }

  private batchAndExecute$(calls$: Observable<any>[]): Observable<any> {
    const groupedResponses: Observable<Asset>[][] = [];
    
    while(calls$.length) {
      groupedResponses.push(calls$.splice(0, BATCH_SIZE));
    }
    
    return concat(
      ...groupedResponses.map((group) => merge(...group))
    ).pipe(
      toArray(),
      tap(() => {
        this.dataChanged$.next(true);
      })
    );
  }
}