import { Component, OnInit } from '@angular/core';
import { Conge } from '../../models/Conge';
import { CongeService } from '../../services/conge/conge.service';

@Component({
  selector: 'app-conge-list',
  templateUrl: './conge-list.component.html',
  styleUrl: './conge-list.component.css'
})
export class CongeListComponent implements OnInit {
  conges!: Conge[];

  constructor(private congeService: CongeService) { }

  ngOnInit(): void {
    this.fetchConges();
  }

  fetchConges(): void {
    this.congeService.afficherConges().subscribe(conges => {
      this.conges = conges;
    });
  }
  confirmerConge(id: number): void {
    this.congeService.confirmerConge(id).subscribe(
      () => {
        alert('Congé confirmé avec succès');
      },
      (error) => {
        console.error('Erreur lors de la confirmation du congé :', error);
      }
    );
  }

  refuserConge(id: number): void {
    this.congeService.refuserConge(id).subscribe(
      () => {
        alert('Congé refusé avec succès');
      },
      (error) => {
        console.error('Erreur lors du refus du congé :', error);
      }
    );
  }
  
}
