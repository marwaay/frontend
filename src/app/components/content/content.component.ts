import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/profile/user.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent  implements OnInit{

  solde!: number;
 congesCount!:number;
 countOfCongesConfirmer: number = 0;
 percentageOfConfirmedConges: number = 0;
 userProfile: any = null;
 userId: number | undefined;
  constructor(  private router: Router,private userService:UserService) {}
  ngOnInit(): void {



  
      this.userService.getUserProfile().subscribe(
        (data: any) => {
          this.userProfile = data;
          this.userId = this.userProfile.id;
        },
        (error: any) => {
          console.error('Error fetching user profile:', error);
        }
      );
    
    forkJoin([
      this.userService.getUserSolde(),
      this.userService.getUserId() // Fetch the user Id
    ]).subscribe(
      ([solde, userId]: [string, number]) => {
        this.solde = parseInt(solde, 10);
        if (userId) {
          this.userService.getCountOfCongesByUser(userId).subscribe(
            congesCount => {
              this.congesCount = congesCount;
            },
            error => {
              console.error('Error fetching count of conges:', error);
            }
          );

          this.userService.getCountOfCongesConfirmer(userId).subscribe(
            data => {
              if (data && data.length === 1) {
                const [count, percentage] = data[0];
                this.countOfCongesConfirmer = count;
                this.percentageOfConfirmedConges = percentage;
              }
            },
            error => {
              console.error('Error fetching count and percentage of confirmed congés:', error);
            }
          );
        } else {
          console.error('User ID not found.');
        }
      },
      (error: any) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  redirectToHome() {
    this.router.navigate(['/homee']);
  }
}
     
