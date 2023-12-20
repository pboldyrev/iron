import { AfterViewChecked, Component, Input } from '@angular/core';
import { Chart } from 'chart.js';
import { BehaviorSubject, Observable } from 'rxjs';
import { AssetValue } from 'src/app/shared/constants/constants';
@Component({
  selector: 'app-value-history-chart',
  standalone: true,
  imports: [],
  templateUrl: './value-history-chart.component.html',
  styleUrl: './value-history-chart.component.scss'
})
export class ValueHistoryChartComponent {
  @Input() valueHistory$!: Observable<AssetValue[]>;

  public chart: Chart<any> | undefined;

  ngOnInit(): void {
    this.valueHistory$.subscribe((valueHistory) => {
      let xAxis;
      if(valueHistory?.length > 30) {
        xAxis = valueHistory.map((assetValue) => new Date(assetValue.timestamp ?? 0).toLocaleDateString('en-US', {month: 'short', year: 'numeric'}));
      } else {
        xAxis = valueHistory.map((assetValue) => new Date(assetValue.timestamp ?? 0).toLocaleDateString('en-US', {month: 'short', year: 'numeric', day: 'numeric'}));
      }
      let yAxis = valueHistory.map((assetValue) => assetValue.value ?? 0);
      this.createChart(xAxis, yAxis);
    });
  }

  private createChart(xAxis: string[], yAxis: number[]): void {
    let oldChart = Chart.getChart("valueHistoryChart");
    if(oldChart){
      oldChart.clear();
      oldChart.destroy();
    }

    this.chart = new Chart("valueHistoryChart", {
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
            pointHitRadius: 15,
            pointHoverRadius: 5,
            pointBorderColor: "#095d3b",
            pointBackgroundColor: "#095d3b",
            fill: true,
            backgroundColor: function() {
              const ctx = <HTMLCanvasElement> document.getElementById('valueHistoryChart');

              if(!ctx || !ctx?.getContext('2d')) {
                // no gradient
                return '#181818'
              }

              const gradient = ctx?.getContext('2d')!.createLinearGradient(0, 0, 0, 400);
              gradient.addColorStop(0, '#095d3b');
              gradient.addColorStop(1, 'rgba(0,0,0,0)');

              return gradient;
            },
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        borderColor: "#095d3b",
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

}