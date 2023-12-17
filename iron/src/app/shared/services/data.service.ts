import { Injectable } from '@angular/core';
import { Asset, AssetValue } from '../constants/constants';
import { BehaviorSubject, Observable, Subject, delay, map, max, mergeMap, of, tap } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public dataChanged$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private userAssets$: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
  ) {
    this.fetchUserAssets$().subscribe();
  }

  private fetchUserAssets$(): Observable<any> {
    return this.httpClient.post(
      "https://83ulpu3ica.execute-api.us-west-2.amazonaws.com/Stage/getAssetsByUser",
      {
        sessionToken: this.authService.getSessionToken(),
      },
      {
        headers: {'Content-Type': 'application/json'},
      }
    ).pipe(
      tap((data: any) => {
        this.userAssets$.next(data?.assets ?? []);
      }),
    )
  }

  public getUserAssets$(): Observable<Asset[]> {
    return this.userAssets$.pipe(
      map((assets: Asset[]) => {
        return assets.filter((asset: Asset) => !asset.isArchived);
      })
    );
  }

  public getAllUserAssets$(): Observable<Asset[]> {
    return this.userAssets$.pipe(
      map((assets: Asset[]) => {
        return assets.filter((asset: Asset) => !asset.isArchived);
      })
    );
  }

  public getAssetById$(assetId: string): Observable<Asset> {
    return this.getUserAssets$()
    .pipe(
      map((assets: Asset[]) => {
        let matchedAsset: Asset = {};
        assets.forEach((asset: Asset) => {
          if(asset.assetId === assetId) {
            matchedAsset = asset;
          }
        });
        return matchedAsset;
      }),
      delay(500)
    );
  }

  public addAsset$(asset: Asset): Observable<string | undefined> {
    asset.assetId = uuid();

    if(!asset.account) {
      asset.account = "Other";
    }

    return this.getUserAssets$().pipe(
      map((assets: Asset[]) => {
        assets.push(asset);
        localStorage.setItem("userAssets", JSON.stringify(assets));
        this.dataChanged$.next(true);
        return asset.assetId;
      }),
      delay(500)
    );
  }

  public archiveAsset$(assetId: string): Observable<Asset> {
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
      mergeMap((asset: Asset) => {
        this.fetchUserAssets$().subscribe((data: any) => {
          this.userAssets$.next(data?.assets ?? []);
        });
        return of(asset);
      }),
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
    return this.getUserAssets$()
    .pipe(
      map((assets: Asset[]) => {
        assets.forEach((asset) => {
          if(asset.assetId === assetId) {
            asset.totalValues = asset.totalValues?.filter((asset: AssetValue) => asset.timestamp !== entryToDelete.timestamp);
          }
        });
        localStorage.setItem("userAssets", JSON.stringify(assets));
        this.dataChanged$.next(true);
      }),
      delay(500)
    )
  }
}