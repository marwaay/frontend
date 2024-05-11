import { Component, OnInit } from '@angular/core';
import { CongeChartService } from '../../../services/charts/conge-chart.service';
import { Chart, registerables } from 'chart.js';
import { CountRole } from '../../../models/charts/CountRole';

@Component({
  selector: 'app-role-chart',
  templateUrl: './role-chart.component.html',
  styleUrl: './role-chart.component.css'
})
export class RoleChartComponent implements OnInit {
  chart: any;
  countRoles: CountRole[] = [];

  constructor(private congeService: CongeChartService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.congeService.getCountByRole()
      .subscribe(data => {
        // Filter out the "admin" role
        this.countRoles = data.filter(countRole => countRole.type !== 'ADMIN');
        console.log('Percentage data:', this.countRoles);
        this.renderChart();
      });
  }
  
  renderChart(): void {
    Chart.register(...registerables);
  
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
  
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'bar', // Change chart type to bar
        data: {
          labels: this.countRoles.map(countType => countType.type),
          datasets: [{
            label: 'Count by Type',
            data: this.countRoles.map(countType => countType.count),
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)'
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