import { Component, Input } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Asset } from '../shared/constants/constants';
import { CommonModule } from '@angular/common';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-networth',
  standalone: true,
  imports: [CommonModule, BluHeading, BluSpinner],
  templateUrl: './networth.component.html',
  styleUrl: './networth.component.scss'
})
export class NetworthComponent {
  @Input() userId!: string;

  public curNetworth: string = "";
  public isLoading: boolean = false;

  constructor(
    private dataService: DataService,
  ){}

  ngOnInit() {
    this.isLoading = true;
    combineLatest([
      this.dataService.dataChanged$,
      this.dataService.getUserAssets$(this.userId)
    ]).subscribe(([valueChanged, assets]) => {
      this.computeNetworth(assets);
      this.isLoading = false;
    });
  }

  private computeNetworth(assets: Asset[]): void {
    let networth = 0;
      assets.forEach((asset) => {
        networth += asset.curValue ?? 0;
      });
      this.curNetworth = networth.toLocaleString();
  }

  public getNow(): string {
    const now = new Date();
    return now.toLocaleString();
  }
}
