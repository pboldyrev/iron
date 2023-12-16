import { Component, Input } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Asset } from '../shared/constants/constants';
import { CommonModule } from '@angular/common';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';

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
    this.dataService.getUserAssets$(this.userId).subscribe((assets: Asset[]) => {
      let networth = 0;
      assets.forEach((asset) => {
        networth += asset.curValue ?? 0;
      });
      this.curNetworth = networth.toLocaleString();
      this.isLoading = false;
    });
  }

  public getNow(): string {
    const now = new Date();
    return now.toLocaleString();
  }
}
