import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { DataService } from '../shared/services/data.service';
import { Asset } from '../shared/constants/constants';
import { map } from 'rxjs';

export const hasAssetGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const dataService = inject(DataService);
  const router = inject(Router);
  const assetId = route.params['id'] ?? "";

  return dataService.getActiveAssets()
  .pipe(
    map((assets: Asset[]) => {
      let assetExists: boolean = false;
      assets.forEach((asset) => {
        if(asset.assetId === assetId) {
          assetExists = true;
        }
      });
      if(!assetExists) {
        router.navigate(['/overview']);
      }
      return assetExists;
    })
  );
};
