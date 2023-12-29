import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, Input } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';
import { AssetValue } from '../../constants/constants';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent implements AfterContentInit {
  @Input() values$ = new BehaviorSubject<AssetValue[]>([]);

  public chart: Chart<any> | undefined;

  ngAfterContentInit(): void {
    let xAxis;
    this.values$.subscribe((assetValues: AssetValue[]) => {
      if(assetValues?.length > 30) {
        xAxis = assetValues.map((assetValue) => new Date(assetValue.timestamp ?? 0).toLocaleDateString('en-US', {month: 'short', year: 'numeric', timeZone: 'UTC'}));
      } else {
        xAxis = assetValues.map((assetValue) => new Date(assetValue.timestamp ?? 0).toLocaleDateString('en-US', {month: 'short', year: 'numeric', day: 'numeric', timeZone: 'UTC'}));
      }
      
      let yAxis = assetValues.map((assetValue) => assetValue.value ?? 0);

      if(assetValues.length > 1) {
        this.createChart(xAxis, yAxis);
      }
    });
  }

  private createChart(xAxis: string[], yAxis: number[]): void {
    try {
      let oldChart = Chart.getChart("finacleChart") ?? undefined;
      if(oldChart){
        oldChart.clear();
        oldChart.destroy();
      }
    } catch {}

    try {
      this.chart = new Chart("finacleChart", this.getOptions(xAxis, yAxis));
    } catch {}
  }

  private getOptions(xAxis: string[], yAxis: number[]): ChartConfiguration  {
    return {
      type: 'line',
      data: {
        labels: xAxis, 
	       datasets: [
          {
            animation: {
              duration: 0,
            },
            data: yAxis,
            spanGaps: true,
            tension: 0,
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
                let formattedValue = labelContent.formattedValue;
                if(formattedValue.startsWith('-')) {
                  formattedValue = formattedValue.replace('-', '');
                  formattedValue = '-$' + formattedValue;
                } else {
                  formattedValue = '$' + formattedValue;
                }
                return formattedValue;
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
              display: false,
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
              maxRotation: 0,
              autoSkipPadding: 20,
              display: true,
              callback: (yValue: string | number) => {
                let yValueAsNum = parseInt(yValue.toString());

                let prefix;

                if(yValueAsNum < 0) {
                  prefix = '-$'
                  yValueAsNum = Math.abs(yValueAsNum);
                } else {
                  prefix = '$'
                }

                if(yValueAsNum >= 1000 && yValueAsNum < 1000000) {
                  return prefix + (yValueAsNum / 1000).toLocaleString() + 'K';
                } else if (yValueAsNum > 1000000) {
                  return prefix + (yValueAsNum / 1000000).toLocaleString() + 'M';
                } else {
                  return prefix + yValue.toLocaleString();
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
    }
  }

  private getBackgroundColor(yValues: number[]): CanvasGradient | string {
    const ctx = <HTMLCanvasElement> document.getElementById('finacleChart');

    if(!ctx || !ctx?.getContext('2d') || !ctx?.getContext('2d')?.createLinearGradient(0, 0, 0, 250)) {
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

    const gradient = ctx?.getContext('2d')!.createLinearGradient(0, 0, 0, 250);
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
