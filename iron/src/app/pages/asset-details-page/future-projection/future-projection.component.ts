import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluInput } from 'projects/blueprint/src/lib/input/input.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BluSelect } from 'projects/blueprint/src/lib/select/select.component';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Asset, AssetType, AssetValue } from '../../../shared/constants/constants';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { Chart } from 'chart.js';
import { ChartService } from '../../../shared/services/chart.service';

@Component({
  selector: 'app-future-projection',
  standalone: true,
  imports: [CommonModule, BluModal, BluInput, BluButton, BluSelect, BluText],
  templateUrl: './future-projection.component.html',
  styleUrl: './future-projection.component.scss'
})
export class FutureProjectionComponent {
  @ViewChild("depreciationRateInput") depreciationRateInput!: BluInput;
  @ViewChild("timeframeInput") timeframeInput!: BluSelect;
  
  @Input() asset$ = new Observable<Asset>();
  @Input() assetName = "";
  @Input() assetType = AssetType.Vehicle;
  @Input() assetValues = [] as AssetValue[];
  projectionChart: Chart | null = null;

  constructor(
    private chartService: ChartService,
  ){}

  FeedbackType = FeedbackType;
  AssetType = AssetType;

  projectionTimeframes = ['1 year', '2 years', '3 years', '4 years', '5 years', '7 years', '10 years'];
  valueProjection = "";
  selectedTimeframe = "";
  selectedRate = "";
  isDepreciation = true;

  ngAfterContentChecked() {
    this.asset$.subscribe((asset: Asset) => {
      if(!this.depreciationRateInput) {
        return;
      }
      this.isDepreciation = asset.assetType === AssetType.Vehicle;
      if(asset.assetType === AssetType.Cash) {
        this.depreciationRateInput.value = (asset.appreciationRate ?? 0).toString();
        this.depreciationRateInput.formatValue();
      } else {
        this.depreciationRateInput.value = "15%";
      }
    });
  }

  updateChart(): void {
    if(!this.depreciationRateInput.validate() || 
        !this.timeframeInput.validate()) {
      return;
    }

    const rate = parseFloat(this.depreciationRateInput.value) / 100;
    if(Math.abs(rate) > 1) {
      this.depreciationRateInput.customFeedback = "The " + this.isDepreciation ? "depreciation rate" : "APY" + " must be between 0% and 100%."
      this.depreciationRateInput.isValid = false;
      return;
    }

    const timeframe = this.timeframeInput.selected;
    const timeframeAsNum = parseInt(timeframe.split(' ')[0]);
    this.selectedTimeframe = timeframe;
    this.selectedRate = (rate * 100).toFixed(2) + "%";
    let projections = this.getValueProjections(rate, timeframeAsNum);

    if(this.projectionChart) {
      this.projectionChart.data = this.chartService.getDataSet(projections);
      this.projectionChart.options.borderColor = this.chartService.getBorderColor(projections);
      this.projectionChart.update();
    } else {
      this.projectionChart = new Chart('projectionChart', this.chartService.getOptions(projections));
    }
  }

  private getValueProjections(appreciationRate: number, years: number): AssetValue[] {
    if(this.assetValues.length === 0) {
      return [] as AssetValue[];
    }

    let latestValue = this.assetValues[this.assetValues.length-1].totalValue;
    const latestDate = this.assetValues[this.assetValues.length-1].timestamp;

    const projection = [] as AssetValue[];
    const monthInMs = 2629800000;

    for(let i = 1; i < 12 * years; ++i) {
      if(this.isDepreciation) {
        latestValue = latestValue * (1-(appreciationRate/12));
      } else {
        latestValue = latestValue * (1+(appreciationRate/12));
      }
      projection.push({
        timestamp: latestDate + i * monthInMs,
        totalValue: latestValue,
        units: 1
      })
    }
    this.valueProjection = latestValue.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return projection;
  }
}
