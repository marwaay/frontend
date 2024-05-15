import { Component, ElementRef, ViewChild } from '@angular/core';
import { Conge } from '../../../models/Conge';
import { PersonnelserviceService } from '../../../personnel/personnelservice.service';
import { ImageService } from '../../../services/ImageService/image.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/profile/user.service';
import { CongeService } from '../../../services/conge/conge.service';

@Component({
  selector: 'app-mesconges',
  templateUrl: './mesconges.component.html',
  styleUrl: './mesconges.component.css'
})
export class MescongesComponent {
  userProfile: any;
  userId: number | undefined;
  conges: Conge[] = [];






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
console.log(this.userId)
        },
        (error: any) => {
          console.error('Error fetching user profile:', error);
        }
      );
      console.log()
this.affichertousconges()
    }



    private affichertousconges(): void {
      this.congeService.afficherConges()
        .subscribe(conges => {
          // Filtrer les congés en attente
          this.conges = conges.filter(conge => conge.user.id === this.userId);
        });
  
    }
  
  
redirectToHome() {
  this.router.navigate(['/home']);
}



//getimage
imageSrc: string | ArrayBuffer | null = null; // Assurez-vous que cette ligne est présente

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



searchCongess(query: string) {
  if (query.trim() !== '') {
    this.profile.searchCongess(query)
      .subscribe(
        (data) => {
          this.conges =  data;
        },
        (error) => {
          this.conges=[];

          console.error('Une erreur s\'est produite lors de la recherche : ', error);
        }
      );
  } else {
this.conges=[];
  }
}

}











