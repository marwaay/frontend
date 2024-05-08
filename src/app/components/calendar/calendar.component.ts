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
      daysOfWeek: [1, 2, 3, 4, 5], // Monday through Friday
      startTime: '08:00', // Start time for the business hours
      endTime: '18:00' // End time for the business hours
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
        this.calendarOptions.events = conges.map((conge) => {
          return {
            title: "Congé",
            start: new Date(conge.date_debut), 
            end: new Date(conge.date_fin)
          };
        });
      },
      error: (error) => {
        console.error('Error loading conges:', error);
        // Handle error gracefully
      }
    });
  }
  redirectToHome() {
    this.router.navigate(['/homee']);
  }
}
