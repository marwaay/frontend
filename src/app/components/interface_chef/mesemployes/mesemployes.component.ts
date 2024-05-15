import { Component, ElementRef, ViewChild } from '@angular/core';
import { Personnel } from '../../../models/Personnel';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { NotificationService } from '../../../services/notification/notification.service';
import { UserService } from '../../../services/profile/user.service';
import { PersonnelserviceService } from '../../../personnel/personnelservice.service';

@Component({
  selector: 'app-mesemployes',
  templateUrl: './mesemployes.component.html',
  styleUrl: './mesemployes.component.css'
})
export class MesemployesComponent {
  employes: Personnel[] = [];
  employe: Personnel = new Personnel;
  private subscription!: Subscription;
  unreadNotificationCount: number = 0;
  userProfile: any;
  userId: number | undefined;
  service!:string;

  constructor(
    private afficherusersService: PersonnelserviceService,
    private router:Router,    private notificationService:NotificationService, private profile :UserService,


  ) {


  }

  ngOnInit(): void {



    

      // Vérifie si la page a déjà été rechargée
      const hasReloaded = localStorage.getItem('hasReloaded');

      // Si la page n'a pas encore été rechargée, effectue le rechargement
      if (!hasReloaded) {
        // Recharge la page
        window.location.reload();
        // Enregistre l'état du rechargement dans le stockage local
        localStorage.setItem('hasReloaded', 'true');
      }

      

    this.profile.getUserProfile().subscribe(
      (data: any) => {
        this.userProfile = data;
        this.userId = this.userProfile.id;
         this.service=this.userProfile.service;

      },
      (error: any) => {
        console.error('Error fetching user profile:', error);
      }
    );
    console.log()








    this.affichertousemployes();
  }

  private affichertousemployes() {
    this.afficherusersService.getAllEmployees()
      .subscribe((employes) => {
        this.employes = employes.filter(employe => employe.service === this.service);
      });
  }



  afficherEmploye(id: number): void{
    this.router.navigate(['admin/afficheruser',id]);
    }
  showModal: boolean = false;
  role: string = '';

  openModal(role: string) {
    this.role = role;
    this.showModal = true;
    console.log(this.showModal)

  }

  closeModal(): void {
    this.showModal = false;
  console.log(this.showModal)
  }
  redirectToHome() {
    this.router.navigate(['/home']);
  }



  employeIdToDelete: number | null = null;




  afficherConfirmationSuppression(employeId: number): void {
    this.employeIdToDelete = employeId;
  }
  annulerSuppression(): void {
    this.employeIdToDelete = null;
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

searchUsers(query: string) {
  if (query.trim() !== '') {
    this.profile.searchUsers(query)
      .subscribe(
        (data) => {
          if (data.length > 0) {
            this.employes = data.filter(employe => employe.service === this.service && employe.role ==="EMPLOYEE");
          } else {
            this.employes = [];
          }
        },
        (error) => {
          this.employes = [];

          console.error('Une erreur s\'est produite lors de la recherche : ', error);
        }
      );
  } else {
    this.employes = [];
  }
}



}
