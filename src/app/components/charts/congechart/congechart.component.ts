import { Component, OnInit } from '@angular/core';
import { CountType } from '../../../models/charts/CountType';
import { CongeChartService } from '../../../services/charts/conge-chart.service';
import { Chart,  registerables } from 'chart.js';

@Component({
  selector: 'app-congechart',
  templateUrl: './congechart.component.html',
  styleUrl: './congechart.component.css'
})
export class CongechartComponent  implements OnInit{
  chart: any;
  countTypes: CountType[] = [];

  constructor(private congeService: CongeChartService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.congeService.getPercentageGroupByType()
      .subscribe(data => {
        this.countTypes = data;
        console.log('Percentage data:', this.countTypes);
        this.renderChart();
      });
      
  }
  renderChart(): void {
    Chart.register(...registerables);
  
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
  
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'pie', 
        data: {
          labels: this.countTypes.map(countType => countType.type),
          datasets: [{
            label: 'Count by Type',
            data: this.countTypes.map(countType => countType.count),
            backgroundColor: [
              'rgba(153, 102, 255, 0.6)', 
              'rgba(54, 162, 235, 0.6)',  
              'rgba(75, 192, 192, 0.6)'     
           
            ]
          }]
        },
        options: {
          responsive: true,
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
            }
          }
        }
      });
    } else {
      console.error('Failed to acquire context from the canvas element.');
    }
  }
  
}