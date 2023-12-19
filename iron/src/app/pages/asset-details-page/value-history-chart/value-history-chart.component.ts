import { AfterViewChecked, Component, Input } from '@angular/core';
import { Chart } from 'chart.js';
@Component({
  selector: 'app-value-history-chart',
  standalone: true,
  imports: [],
  templateUrl: './value-history-chart.component.html',
  styleUrl: './value-history-chart.component.scss'
})
export class ValueHistoryChartComponent {
  public chart: Chart<any> | undefined;

  ngOnInit(): void {
    this.createChart();
  }

  private createChart(): void {
    let oldChart = Chart.getChart("valueHistoryChart");
    if(oldChart){
      oldChart.clear();
      oldChart.destroy();
    }
    
    this.chart = new Chart("valueHistoryChart", {
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
        maintainAspectRatio: false,
      }
    });
  }
}
