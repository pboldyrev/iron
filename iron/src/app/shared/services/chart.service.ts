import { Injectable } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { AssetValue } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  public getOptions(data: AssetValue[]): ChartConfiguration  {
    let xAxis;

    if(data.length > 30) {
      xAxis = data.map((assetValue) => new Date(assetValue.timestamp ?? 0).toLocaleDateString('en-US', {month: 'short', year: 'numeric', timeZone: 'UTC'}));
    } else {
      xAxis = data.map((assetValue) => new Date(assetValue.timestamp ?? 0).toLocaleDateString('en-US', {month: 'short', year: 'numeric', day: 'numeric', timeZone: 'UTC'}));
    }
    
    let yAxis = data.map((assetValue) => assetValue.value ?? 0);

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
            borderWidth: () => {
              if(xAxis.length > 1) {
                return 5;
              }
              return 0;
            },
            borderJoinStyle: "round",
            pointRadius: () => {
              if(xAxis.length > 1) {
                return 0;
              }
              return 5;
            },
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
            bodyFont: {
              family: 'Rethink Sans'
            },
            titleFont: {
              family: 'Rethink Sans'
            },
            footerFont: {
                family: 'Rethink Sans'
            },
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
              display: xAxis.length === 1,
              autoSkip: true,
              maxRotation: 0,
              autoSkipPadding: 20,
              font: {
                family: 'Rethink Sans'
              }
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
              font: {
                family: 'Rethink Sans'
              },
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
      yValues[0] > yValues[yValues.length-1]
    ) {
      return "#c43528";
    } else {
      return "#095d3b";
    }
  }
}
