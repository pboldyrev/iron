import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  public chart: Chart<any> | undefined;

  private xLabels: number[] = [];

  constructor(
    private dataService: DataService,
  ) {}

  ngOnInit(): void {
    this.dataService.getHistoricalNetWorth$().subscribe({
      next: (historicalNetWorth: AssetValue[]) => {
        let x = historicalNetWorth.map((assetValue) => new Date(assetValue.timestamp ?? 0).getFullYear());
        let y = historicalNetWorth.map((assetValue) => assetValue.value ?? 0);
        this.createChart(x, y);
      },
      error: () => {

      }
    });
  }

  private createChart(x: number[], y: number[]): void {
    this.chart = new Chart("chart", {
      type: 'line',
      data: {
        labels: x, 
	       datasets: [
          {
            data: y,
            spanGaps: true,
            tension: 0.5,
            borderWidth: 5,
            borderJoinStyle: "round",
            borderCapStyle: "round",
            pointRadius: 0,
            pointHitRadius: 15,
            pointHoverRadius: 5,
            pointBorderColor: "#095d3b",
            pointBackgroundColor: "#095d3b",
            fill: true,
            backgroundColor: function() {
              const ctx = <HTMLCanvasElement> document.getElementById('chart');

              if(!ctx || !ctx?.getContext('2d')) {
                // no gradient
                return '#131313'
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
            },
            title: {
              display: false,
            },
            grid: {
              display: false,
            }
          },
          y: {
            position: "right",
            ticks: {
              display: true,
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
