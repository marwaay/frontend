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

  constructor(  private router: Router,private userService:UserService) {}
  ngOnInit(): void {
    forkJoin([
      this.userService.getUserSolde(),
    ]).subscribe(
      ([solde]: [string]) => {
        this.solde = parseInt(solde, 10); 
  
    //  console.log('user solde:', this.solde);
       
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
