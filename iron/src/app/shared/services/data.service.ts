import { Injectable } from '@angular/core';
import { Asset } from '../constants/constants';
import { Observable, Subject, delay, map, of } from 'rxjs';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public dataChanged$: Subject<boolean> = new Subject<boolean>();

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
}