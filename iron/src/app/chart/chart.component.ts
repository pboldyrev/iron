import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent {
  public chart: Chart<any> | undefined;

  ngOnInit(): void {
    this.createChart();
  }

  private createChart(): void {
  
    this.chart = new Chart("chart", {
      type: 'line',

      data: {
        labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13', '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17', ], 
	       datasets: [
          {
            label: "Sales",
            data: ['467','576', '572', '79', '92', '574', '573', '576'],
          }
        ]
      },

      options: {
        responsive: true,
      }
    });
  }
}
