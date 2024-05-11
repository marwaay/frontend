import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CongeChartService } from '../../../services/charts/conge-chart.service';
import { CountType } from '../../../models/charts/CountType';
import { UserService } from '../../../services/profile/user.service';
import { Observable, forkJoin } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CongeService } from '../../../services/conge/conge.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-percongechart',
  templateUrl: './percongechart.component.html',
  styleUrl: './percongechart.component.css'
})
export class PercongechartComponent {
  user: number | undefined; // Assuming user ID is a number
  countTypes: CountType[] = []; // Array to store CountType data
  chart: any; // Variable to store the chart instance

  constructor(private profileService: UserService, private dataService: CongeChartService) {}

  ngOnInit(): void {
    // Fetch user ID
    this.profileService.getUserId().subscribe(
      (user: number) => {
        this.user = user;
        console.log('User ID:', this.user);
        
        // Once you have the user ID, fetch data using this ID
        this.dataService.getPercentageGroupByTypeForUser(this.user).subscribe(
          (data: CountType[]) => {
            this.countTypes = data;
            console.log('Data:', this.countTypes);
            
            // After receiving data, render the chart
            this.renderChart();
          },
          (error: any) => {
            console.error('Error fetching data:', error);
          }
        );
      },
      (error: any) => {
        console.error('Error fetching user data:', error);
      }
    );
  }
  renderChart(): void {
    Chart.register(...registerables);
  
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
  
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'pie', // Change chart type to pie
        data: {
          labels: this.countTypes.map(countType => countType.type),
          datasets: [{
            label: 'Count by Type',
            data: this.countTypes.map(countType => countType.count),
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