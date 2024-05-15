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
  user: number | undefined;
  countTypesByType: CountType[] = [];
  countTypesByStatut: CountType[] = [];
  chart1: any;
  chart2: any;

  constructor(private profileService: UserService, private dataService: CongeChartService) {}

  ngOnInit(): void {
    this.profileService.getUserId().subscribe(
      (user: number) => {
        this.user = user;
        console.log('User ID:', this.user);
        
        // Fetch data for chart1
        this.dataService.getPercentageGroupByTypeForUser(this.user).subscribe(
          (data: CountType[]) => {
            this.countTypesByType = data;
            console.log('Data for Chart 1:', this.countTypesByType);
            this.renderChart1();
          },
          (error: any) => {
            console.error('Error fetching data for Chart 1:', error);
          }
        );

        // Fetch data for chart2
        this.dataService.getPercentageBystatut(this.user).subscribe(
          (data: CountType[]) => {
            this.countTypesByStatut = data;
            console.log('Data for Chart 2:', this.countTypesByStatut);
            this.renderChart2();
          },
          (error: any) => {
            console.error('Error fetching data for Chart 2:', error);
          }
        );
      },
      (error: any) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  renderChart1(): void {
    Chart.register(...registerables);
  
    const canvas = document.getElementById('canvas1') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
  
    if (ctx) {
      this.chart1 = new Chart(ctx, {
        type: 'pie',  
        data: {
          labels: this.countTypesByType.map(countType => countType.type),
          datasets: [{
            label: 'Type',
            data: this.countTypesByType.map(countType => countType.count),
            backgroundColor: [
              'rgba(153, 102, 255, 0.6)', 
              'rgba(54, 162, 235, 0.6)',  
              'rgba(75, 192, 192, 0.6)' 
            
            ],
            borderWidth: 1
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
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                font: {
                  size: 14
                }
              }
            },
            title: {
              display: true,
              text: 'Pourcentage par Type',

              font: {
                size: 20,
                weight: 'bold'
              }
            }
          }
        }
      });
    } else {
      console.error('Failed to acquire context from the canvas element for Chart 1.');
    }
  }

  renderChart2(): void {
    Chart.register(...registerables);

    const canvas = document.getElementById('canvas2') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const chartData = this.countTypesByStatut.length > 0 ? this.countTypesByStatut[0] : [];

      this.chart2 = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['En attente', 'Confirmé', 'Rejeté'],
          datasets: [{
            label: 'Status',
            data: chartData,
            backgroundColor: [
             'rgba(153, 102, 255, 0.6)', 
              'rgba(54, 162, 235, 0.6)',  
              'rgba(75, 192, 192, 0.6)' 
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                font: {
                  size: 14
                }
              }
            },
            title: {
              display: true,
              text: 'Pourcentage par Statut',
              font: {
                size: 20,
                weight: 'bold'
              }
            }
          }
        }
      });
    } else {
      console.error('Failed to acquire context from the canvas element for Chart 2.');
    }
  }

}