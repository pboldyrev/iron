import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { AddAssetPopupComponent } from '../add-asset-popup/add-asset-popup.component';
import { BehaviorSubject, Observable, combineLatest, map, mergeMap } from 'rxjs';
import { AssetTableColumn, AssetTableComponent } from '../asset-table/asset-table.component';
import { Asset, AssetType } from '../shared/constants/constants';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NetworthComponent } from '../pages/dashboard-page/networth/networth.component';
import { ValueChangeComponent } from '../pages/dashboard-page/value-change/value-change.component';
import { DataService } from '../shared/services/data.service';

@Component({
  selector: 'app-asset-type-page',
  standalone: true,
  imports: [CommonModule, AddAssetPopupComponent, AssetTableComponent, BluButton, NetworthComponent, ValueChangeComponent],
  templateUrl: './asset-type-page.component.html',
  styleUrl: './asset-type-page.component.scss'
})
export class AssetTypePageComponent {
  @ViewChild('addAssetPopup') addAssetPopup!: AddAssetPopupComponent;

  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public assetTableColumns: AssetTableColumn[] = ['account', 'asset', 'units', 'initValue', 'curValue', 'edit']
  public assets$: BehaviorSubject<Asset[]> = new BehaviorSubject<Asset[]>([]);
  public assetType$: Observable<string> = this.route.paramMap.pipe(map((params: any) => params.params.assetType));

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
  ){}

  ngOnInit() {
    this.fetchAssets();
  }

  public onNavigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  public onAddAsset(): void {
    this.addAssetPopup.show();
  }

  private fetchAssets(): void {
    combineLatest([
      this.assetType$,
      this.dataService.getAssets$(false, this.isLoading$)
    ]).subscribe(([assetType, assets]) => {
        this.assets$.next(assets.filter((asset: Asset) => asset.assetType === assetType));
      }
    );

    this.dataService.dataChanged$.pipe(
      mergeMap(() => {
        return combineLatest([
          this.assetType$,
          this.dataService.getAssets$(false, this.isLoading$)
        ])
      })
    ).subscribe({
      next: ([assetType, assets]) => {
        this.assets$.next(assets.filter((asset: Asset) => asset.assetType === assetType));
      },
      error: (error) => {
        console.log(error);
        this.isLoading$.next(false);
      }
    });
  }
}
