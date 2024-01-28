import { Injectable } from '@angular/core';
import { ChartConfiguration, ChartTypeRegistry } from 'chart.js';
import { AssetValue } from '../constants/constants';
import { GroupSummary } from 'src/app/pages/dashboard-page/account-summary/account-summary.component';
import { DisplayPercentPipe } from 'projects/blueprint/src/lib/common/pipes/display-percent.pipe';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DisplayCurrencyPipe } from 'projects/blueprint/src/lib/common/pipes/display-currency.pipe';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  public getPieOptions(data: GroupSummary[]): ChartConfiguration {
    let currencyPipe = new DisplayCurrencyPipe();
    return {
      plugins: [ChartDataLabels],
      type: 'doughnut',
      data: this.getDataSetPie(data),
      options: {
        responsive: true,
        borderColor: "rgba(0,0,0,0)",
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            display: 'auto',
            labels: {
              name: {
                align: 'top',
                font: {
                  family: 'Outfit',
                  size: 14,
                },
                color: '#e1e1e1',
                formatter: function(value, ctx: any) {
                  return ctx.chart.data.labels[ctx.dataIndex];
                }
              },
              value: {
                align: 'bottom',
                backgroundColor: function(ctx: any) {
                  var value = ctx.dataset.data[ctx.dataIndex];
                  return value > 50 ? '#e1e1e1' : null;
                },
                borderColor: '#e1e1e1',
                borderWidth: 2,
                borderRadius: 4,
                color: function(ctx: any) {
                  return ctx.dataset.backgroundColor
                },
                formatter: function(value) {
                  return currencyPipe.transform(value);
                },
                padding: 4,
            },
          },
        },
          tooltip: {
            filter: () => false,
          },
          legend: {
            display: false,
          },
        },
      }
    }
  }

  public getOptions(data: AssetValue[], type: string = 'line'): ChartConfiguration {
    return {
      type: type as keyof ChartTypeRegistry,
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
              display: false,
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
                let yValueAsNum = parseFloat(yValue.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }));

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
          backgroundColor: this.getBackgroundColor(data),
        }
      ],
    }
  }

  public getDataSetPie(data: GroupSummary[]) {
    let valueData = data.map((summary: GroupSummary) => summary.assetValue);
    return {
      labels: data.map((summary: GroupSummary) => summary.name), 
      datasets: [
        {
          backgroundColor: [
            '#0b8457',
            '#075e3e',
            '#05422c',
            '#043523',
            '#032116',
          ],
          animation: {
            duration: 0,
          },
          data: valueData,
          spanGaps: true,
          tension: 0.5,
          borderWidth: () => {
            if(valueData.length > 1) {
              return 2;
            }
            return 0;
          },
          borderJoinStyle: "round",
          pointRadius: () => {
            if(valueData.length > 1) {
              return 0;
            }
            return 5;
          },
          pointHitRadius: 20,
          pointHoverRadius: 5,
          fill: true,
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

  public getBackgroundColor(data: AssetValue[]): string {
    let xAxis, yAxis;

    [xAxis, yAxis] = this.getAxisData(data);

    if(yAxis[0] > yAxis[yAxis.length-1]) {
      return "#301818";
    } else {
      return "#183118";
    }
  }

  private getAxisData(data: AssetValue[]): [string[], number[]] {
    let xAxis;

    if(data.length > 30) {
      xAxis = data.map((assetValue: AssetValue) => new Date(assetValue.timestamp ?? 0).toLocaleDateString('en-US', {month: 'short', year: 'numeric', day: 'numeric', timeZone: 'UTC'}));
    } else {
      xAxis = data.map((assetValue: AssetValue) => new Date(assetValue.timestamp ?? 0).toLocaleDateString('en-US', {month: 'short', year: 'numeric', day: 'numeric', timeZone: 'UTC'}));
    }
    
    let yAxis = data.map((assetValue) => assetValue.totalValue ?? 0);

    return [xAxis, yAxis]
  }
}
