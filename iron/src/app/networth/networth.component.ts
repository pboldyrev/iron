import { Component, Input } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Asset } from '../shared/constants/constants';
import { CommonModule } from '@angular/common';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';
import { BehaviorSubject, combineLatest, mergeMap, tap } from 'rxjs';

@Component({
  selector: 'app-networth',
  standalone: true,
  imports: [CommonModule, BluHeading, BluSpinner],
  templateUrl: './networth.component.html',
  styleUrl: './networth.component.scss'
})
export class NetworthComponent {
  public curNetworth: string = "";
  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private dataService: DataService,
  ){}

  ngOnInit() {
    this.fetchData$().subscribe();

    this.dataService.dataChanged$.pipe(
      mergeMap(() => {
        return this.fetchData$()
      })
    ).subscribe();
  }

  private fetchData$() {
    return this.dataService.getActiveAssets(this.isLoading$)
    .pipe(
      tap((assets: Asset[]) => {
        this.computeNetworth(assets);
      }),
    )
  }

  private computeNetworth(assets: Asset[]): void {
    let networth = 0;
    assets.forEach((asset) => {
      networth += parseInt(asset.curValue ?? '0');
    });
    this.curNetworth = networth.toLocaleString();
  }

  public getNow(): string {
    const now = new Date();
    const options: {
      hour: '2-digit',
      minute: '2-digit',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    } = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit',
    };
    return now.toLocaleString("en-US", options);
  }
}
//  interface DateTimeFormatOptions {
//         localeMatcher?: "best fit" | "lookup" | undefined;
//         weekday?: "long" | "short" | "narrow" | undefined;
//         era?: "long" | "short" | "narrow" | undefined;
//         year?: "numeric" | "2-digit" | undefined;
//         month?: "numeric" | "2-digit" | "long" | "short" | "narrow" | undefined;
//         day?: "numeric" | "2-digit" | undefined;
//         hour?: "numeric" | "2-digit" | undefined;
//         minute?: "numeric" | "2-digit" | undefined;
//         second?: "numeric" | "2-digit" | undefined;
//         timeZoneName?: "short" | "long" | "shortOffset" | "longOffset" | "shortGeneric" | "longGeneric" | undefined;
//         formatMatcher?: "best fit" | "basic" | undefined;
//         hour12?: boolean | undefined;
//         timeZone?: string | undefined;
//     }