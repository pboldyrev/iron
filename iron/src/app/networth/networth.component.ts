import { Component, Input } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Asset } from '../shared/constants/constants';
import { CommonModule } from '@angular/common';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';
import { BehaviorSubject, combineLatest, mergeMap, tap } from 'rxjs';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluPill } from 'projects/blueprint/src/lib/pill/pill.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';

export type TimeRangeOption = {
  selected: boolean,
  value: string
}

@Component({
  selector: 'app-networth',
  standalone: true,
  imports: [CommonModule, BluHeading, BluSpinner, BluButton, BluPill, BluText],
  templateUrl: './networth.component.html',
  styleUrl: './networth.component.scss'
})
export class NetworthComponent {
  @Input() subheading: string = "Net Worth";

  public curNetworth: string = "";
  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public timeRangeOptions: TimeRangeOption[] = [
    {
      selected: true,
      value: "Week"
    },
    {
      selected: false,
      value: "Month"
    },
    {
      selected: false,
      value: "Year"
    },
    {
      selected: false,
      value: "All"
    }
  ];

  constructor(
    private dataService: DataService,
  ){}

  ngOnInit() {
    this.fetchData$().subscribe();

    this.dataService.dataChanged$.pipe(
      mergeMap(() => {
        return this.fetchData$()
      })
    ).subscribe({
      next: () => {},
      error: (error) => {
        console.log(error);
        this.isLoading$.next(false);
        this.curNetworth = "ERR";
      }
    });
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
      networth += asset.curValue ?? 0;
    });
    this.curNetworth = networth.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2});
  }

  public onPillClicked(selectedOption: TimeRangeOption) {
    selectedOption.selected = true;
    this.timeRangeOptions.forEach((option: TimeRangeOption) => {
      if(option.value != selectedOption.value){
        option.selected = false;
      }
    });
  }
}