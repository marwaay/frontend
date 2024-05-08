import { Component, ElementRef, ViewChild } from '@angular/core';
import { PersonnelserviceService } from '../../../personnel/personnelservice.service';
import { UserService } from '../../../services/profile/user.service';
import { CongeService } from '../../../services/conge/conge.service';
import { Router } from '@angular/router';
import { Conge } from '../../../models/Conge';
import { ImageService } from '../../../services/ImageService/image.service';

@Component({
  selector: 'app-afficherconges',
  templateUrl: './afficherconges.component.html',
  styleUrl: './afficherconges.component.css'
})
export class AffichercongesComponent {
  conges: Conge[] = [];
  userProfile: any;
  userId: number | undefined;
  id_chef!:number;

  constructor(
    private congeService: CongeService,
    private router: Router,
    private imageService:ImageService,
    private profile :UserService
     ) {}

  ngOnInit(): void {
    this.profile.getUserProfile().subscribe(
      (data: any) => {
        this.userProfile = data;
        this.userId = this.userProfile.id;
         
      },
      (error: any) => {
        console.error('Error fetching user profile:', error);
      }
    );
    console.log()
    this.affichertousconges();
  }

  private affichertousconges(): void {
    this.congeService.afficherConges()
      .subscribe(conges => {
        // Filtrer les congés en attente
        this.conges = conges.filter(conge => conge.statut === 'En_Attente' && conge.chef === this.id_chef);



      });

  }



  refuserConge(id: number): void {
    this.congeService.refuserConge(id).subscribe(
      () => {
        window.location.reload();

      },
      (error) => {
        console.error('Erreur lors du refus du congé :', error);
      }
    );

  }


  confirmerConge(id: number): void {
    this.congeService.confirmerConge(id).subscribe(
      () => {
        window.location.reload();

      },
      (error) => {
        console.error('Erreur lors de la confirmation du congé :', error);
      }
    );

  }


getStatusStyle(statut: string): any {
  switch (statut) {
    case 'Confirmé':
      return { 'background-color': '#90EE90', color: 'white', 'border-radius': '10px' };
    case 'Refusé':
      return { 'background-color': '#DC143C', color: 'white', 'border-radius': '  10px' };
    case 'En_Attente':
      return { 'background-color': '#FFCE26', color: 'white', 'border-radius': '10px' };
    default:
      return {};
  }
}

redirectToHome() {
  this.router.navigate(['/home']);
}
showCalendar: boolean = false;
toggleCalendar(): void {
  this.showCalendar = !this.showCalendar;
}
closeCalendar(): void {
  this.showCalendar = false;
}
//getimage
imageSrc: string | ArrayBuffer | null = null; 

afficherImage(conge: any, fileName: string): void {
  this.imageService.getImage(conge, fileName)
    .subscribe((response: Blob) => {
      const fileURL = URL.createObjectURL(response);
      if (fileName.toLowerCase().endsWith('.pdf')) {
        // Créer un lien <a> avec l'URL blob
        const link = document.createElement('a');
        link.href = fileURL;
        link.target = '_blank'; // Ouvrir dans une nouvelle fenêtre
        link.click(); // Simuler un clic sur le lien
      } else {
        this.imageSrc = fileURL;
      }
    }, error => {
      console.error('Erreur lors du chargement du fichier:', error);
      this.imageSrc = null;
    });
}



getCongeId(conge: any): number {
  return conge.id;
}
getCongefile(conge: any): string {
  return conge.file;
}
closeImage(): void {
  this.imageSrc = null;

}
//recherche
showSearchBox: boolean = false;
searchQuery: string = '';
selectedType: string = '';
toggleSearchBox(): void {
  this.showSearchBox = !this.showSearchBox;
}


@ViewChild('searchInput') searchInput!: ElementRef;


openSearchBox(): void {
  this.showSearchBox = true;
  setTimeout(() => {
    this.searchInput.nativeElement.focus();
  }, 0);
}

searchcongess(query: string) {
  if (query.trim() !== '') {
    this.profile.searchCongess(query)
      .subscribe(
        (data) => {
            this.conges = data;
         
        },
        (error) => {
          this.conges = [];
          console.error('Une erreur s\'est produite lors de la recherche : ', error);
        }
      );
  } else {
    this.conges = [];
  }
}


}
