import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Chart } from 'chart.js';
import { AssetValue } from '../shared/constants/constants';
import { BehaviorSubject } from 'rxjs';
import { DataService } from '../shared/services/data.service';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './networth-chart.component.html',
  styleUrl: './networth-chart.component.scss'
})
export class ChartComponent {
  @Input() assetValues!: AssetValue[];

  public chart: Chart<any> | undefined;

  ngOnInit(): void {
    let xAxis;
    if(this.assetValues?.length > 30) {
      xAxis = this.assetValues.map((assetValue) => new Date(assetValue.timestamp ?? 0).toLocaleDateString('en-US', {month: 'short', year: 'numeric', timeZone: 'UTC'}));
    } else {
      xAxis = this.assetValues.map((assetValue) => new Date(assetValue.timestamp ?? 0).toLocaleDateString('en-US', {month: 'short', year: 'numeric', day: 'numeric', timeZone: 'UTC'}));
    }
    let yAxis = this.assetValues.map((assetValue) => assetValue.value ?? 0);
    this.createChart(xAxis, yAxis);
  }

  private createChart(xAxis: string[], yAxis: number[]): void {
    let oldChart = Chart.getChart("networthChart");
    if(oldChart){
      oldChart.clear();
      oldChart.destroy();
    }

    this.chart = new Chart("networthChart", {
      type: 'line',
      data: {
        labels: xAxis, 
	       datasets: [
          {
            data: yAxis,
            spanGaps: true,
            tension: 0.5,
            borderWidth: 5,
            borderJoinStyle: "round",
            pointRadius: 0,
            pointHitRadius: 20,
            pointHoverRadius: 5,
            pointBorderColor: this.getBorderColor(yAxis),
            pointBackgroundColor: this.getBorderColor(yAxis),
            fill: true,
            backgroundColor: this.getBackgroundColor(yAxis),
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        borderColor: this.getBorderColor(yAxis),
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: '#181818',
            borderColor: '#363636',
            borderWidth: 1,
            displayColors: false,
            callbacks: {
              label: function(labelContent) {
                return '$' + labelContent.formattedValue;
              }
            },
          }
        },
        hover: {
          intersect: true,
        },
        scales: {
          x: {
            ticks: {
              display: true,
              autoSkip: true,
              maxRotation: 0,
              autoSkipPadding: 20,
            },
            title: {
              display: false,
            },
            grid: {
              display: false,
            },
          },
          y: {
            position: "right",
            ticks: {
              display: true,
              callback: (yValue: string | number) => {
                const yValueAsNum = parseInt(yValue.toString());

                if(yValueAsNum >= 1000 && yValueAsNum < 1000000) {
                  return '$' + (yValueAsNum / 1000).toLocaleString() + 'K';
                } else if (yValueAsNum > 1000000) {
                  return '$' + (yValueAsNum / 1000000).toLocaleString() + 'M';
                } else {
                  return '$' + yValue.toLocaleString();
                }
              }
            },
            title: {
              display: false,
            },
            grid: {
              display: false,
            }
          },
        },
      }
    });
  }

  private getBackgroundColor(yValues: number[]): CanvasGradient | string {
    const ctx = <HTMLCanvasElement> document.getElementById('networthChart');

    if(!ctx || !ctx?.getContext('2d')) {
      // no gradient
      return '#181818'
    }

    let gradientColor: string;

    if(
      yValues && 
      yValues.length > 0 && 
      yValues[0] >= yValues[yValues.length-1]
    ) {
      gradientColor = "#c43528";
    } else {
      gradientColor = "#095d3b";
    }

    const gradient = ctx?.getContext('2d')!.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, gradientColor);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    return gradient;
  }

  private getBorderColor(yValues: number[]): string {
    if(
      yValues && 
      yValues.length > 0 && 
      yValues[0] >= yValues[yValues.length-1]
    ) {
      return "#c43528";
    } else {
      return "#095d3b";
    }
  }
}
