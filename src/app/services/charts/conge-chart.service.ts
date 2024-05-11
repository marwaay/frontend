import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CountType } from '../../models/charts/CountType';
import { CountRole } from '../../models/charts/CountRole';
import { CountSexe } from '../../models/charts/CountSexe';

@Injectable({
  providedIn: 'root'
})
export class CongeChartService {

  private baseUrl = 'http://localhost:8080'; 

  constructor(private http: HttpClient) { }

  getPercentageGroupByType(): Observable<CountType[]> {
    return this.http.get<CountType[]>(`${this.baseUrl}/percentCountType`);
  }

  getPercentageGroupByRole(): Observable<CountRole[]> {
    return this.http.get<CountRole[]>(`${this.baseUrl}/personnels/percentageByRole`);
  }

  getCountByRole(): Observable<CountRole[]> {
    return this.http.get<CountRole[]>(`${this.baseUrl}/personnels/countByRole`);
  }

  getPercentageGroupBySexe(): Observable<CountSexe[]> {
    return this.http.get<CountSexe[]>(`${this.baseUrl}/personnels/percentageBySexe`);
  }


  getPercentageGroupByTypeForUser(userId: number): Observable<CountType[]> {
    return this.http.get<CountType[]>(`${this.baseUrl}/percentCountType/${userId}`);
  }


  
}
