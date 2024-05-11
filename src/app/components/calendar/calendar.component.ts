import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CongeService } from '../../services/conge/conge.service';
import { CalendarOptions, DateSelectArg, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Router } from '@angular/router';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent  implements OnInit{
  @ViewChild('externalEvents', {static: true}) externalEvents!: ElementRef;


  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5], 
      startTime: '08:00', 
      endTime: '18:00' 
    },
    events: []
  };
  
  constructor(private chefService:CongeService, private router:Router) { }

  ngOnInit() {
    this.loadConges();
  }

  loadConges() {
    this.chefService.getCongesConfirmes().subscribe({
      next: (conges) => {
        this.calendarOptions.events = this.mapCongesToEvents(conges);
      },
      error: (error) => {
        console.error('Error loading conges:', error);
        // Handle error gracefully
      }
    });
  }
  
  mapCongesToEvents(conges: any[]): any[] {
    const events: any[] = [];
    const serviceColors: { [service: string]: string } = {}; // Object to store service-color mapping
  
    conges.forEach((conge) => {
      const service = conge.service; // Assuming you have a service property in conge object
      if (!serviceColors[service]) {
        // Assign a color to the service if not already assigned
        serviceColors[service] = this.generateRandomColor();
      }
      events.push({
        title: "Congé",
        start: new Date(conge.date_debut), 
        end: new Date(conge.date_fin),
        backgroundColor: serviceColors[service]
      });
    });
  
    return events;
  }
  
  generateRandomColor(): string {
    // Generate a random hex color
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }
  
  
  redirectToHome() {
    this.router.navigate(['/homee']);
  }
}
