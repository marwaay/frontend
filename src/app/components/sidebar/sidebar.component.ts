import { AfterViewInit, Component } from '@angular/core';
import { LogoutService } from '../../services/logout/logout.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Personnel } from '../../models/Personnel';
import { UserService } from '../../services/profile/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements AfterViewInit{
  personnel: Personnel = new Personnel();
  userId: number | undefined;
  userProfile: any = null;

  
  constructor(private logoutService: LogoutService, private router: Router, private httpClient: HttpClient, private profileService:UserService) { }
//js
  ngAfterViewInit(): void {
    const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
    const menuBar = document.querySelector('#content nav .bx.bx-menu');
    const sidebar = document.getElementById('sidebar');
    const switchMode = document.getElementById('switch-mode');
    const content = document.getElementById('content');

    if (allSideMenu && menuBar && sidebar  && content) {
      allSideMenu.forEach(item => {
        item.addEventListener('click', function(event) {
          event.preventDefault();
          allSideMenu.forEach(i => {
            i.parentElement?.classList.remove('active');
          });
          item.parentElement?.classList.add('active');
        });
      });

      menuBar.addEventListener('click', function() {
        sidebar.classList.toggle('hide');
        if (sidebar.classList.contains('hide')) {
          content.style.width = 'calc(100% - 60px)';
          content.style.left = '60px';
        }
        else {
          content.style.width = 'calc(100% - 280px)';
          content.style.left = '280px';
        }
      });


 /*  switchMode.addEventListener('change', function() {
        if (switchMode instanceof HTMLInputElement) {
          document.body.classList.toggle('dark', switchMode.checked);
        }
      });
*/



      window.addEventListener('resize', function() {
        if (sidebar && content) {
          sidebar.classList.add('hide');
          content.style.width = 'calc(100% - 60px)';
          content.style.left = '60px';
        }
      });
    }


    function ajusterMenuLatéral() {
      if (window.innerWidth < 768 && sidebar) {
        sidebar.classList.add('hide');

      }
    }
  }

//redirecte vers home
  redirectToGererUsers() {
    this.router.navigate(['/admin/gererusers']);
  }


  //redirecte vers archive
  redirectToArchive() {
    this.router.navigate(['/archive']);
  }

  redirectToAjouerConges(){
    this.router.navigate(['conge/demandeconge']);

  }

  redirectToMesConges(){
    this.router.navigate(['mesconges']);

  }

  redirectToCalendrier(){
    this.router.navigate(['calendrier']);

  }
  redirectToDemandes(){
    this.router.navigate(['conge/afficherconges']);

  }

  ngOnInit(): void {
    this.profileService.getUserProfile().subscribe(
      (data: any) => {
        this.userProfile = data;
        this.userId = this.userProfile.id;
      },
      (error: any) => {
        console.error('Error fetching user profile:', error);
      }
    );
  }
  private url = "http://localhost:8080/logout";

  userLogout(personnel: Personnel): Observable<Personnel> {
    return this.httpClient.post<Personnel>(this.url, personnel);
  }

  onLogout() {!
    this.userLogout(this.personnel).subscribe(
      () => {
        localStorage.removeItem('token');
        console.log('Logged out successfully!');
        this.router.navigate(['home']);
      },
      error => {
        console.error('Logout failed:', error);
      }
    );

    }

   
  showSecondaryElements: boolean = false;

  toggleSecondaryElements() {
    this.showSecondaryElements = !this.showSecondaryElements; // Toggle the boolean value
  }
    
}
