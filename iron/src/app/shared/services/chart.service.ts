import { Injectable } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { AssetValue } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  public getOptions(data: AssetValue[]): ChartConfiguration  {
    let xAxis, yAxis;

    [xAxis, yAxis] = this.getAxisData(data);

    return {
      type: 'line',
      data: this.getDataSet(data),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        borderColor: this.getBorderColor(data),
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
              family: 'Outfit'
            },
            titleFont: {
              family: 'Outfit'
            },
            footerFont: {
                family: 'Outfit'
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
              display: true,
              autoSkip: true,
              maxRotation: 0,
              autoSkipPadding: 20,
              font: {
                family: 'Outfit'
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
                family: 'Outfit'
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
                } else if (yValueAsNum >= 1000000) {
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

  public getDataSet(data: AssetValue[]) {
    let xAxis, yAxis;

    [xAxis, yAxis] = this.getAxisData(data);

    return {
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
              return 2;
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
          pointBorderColor: this.getBorderColor(data),
          pointBackgroundColor: this.getBorderColor(data),
          fill: true,
          backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 340);
            gradient.addColorStop(0, this.getBorderColor(data));
            gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
            return gradient;
          },
        }
      ],
    }
  }

  public getBorderColor(data: AssetValue[]): string {
    let xAxis, yAxis;

    [xAxis, yAxis] = this.getAxisData(data);

    if(yAxis[0] > yAxis[yAxis.length-1]) {
      return "#c43528";
    } else {
      return "#095d3b";
    }
  }

  private getAxisData(data: AssetValue[]): [string[], number[]] {
    let xAxis;

    if(data.length > 30) {
      xAxis = data.map((assetValue) => new Date(assetValue.timestamp ?? 0).toLocaleDateString('en-US', {month: 'short', year: 'numeric', day: 'numeric', timeZone: 'UTC'}));
    } else {
      xAxis = data.map((assetValue) => new Date(assetValue.timestamp ?? 0).toLocaleDateString('en-US', {month: 'short', year: 'numeric', day: 'numeric', timeZone: 'UTC'}));
    }
    
    let yAxis = data.map((assetValue) => assetValue.totalValue ?? 0);

    return [xAxis, yAxis]
  }
}
