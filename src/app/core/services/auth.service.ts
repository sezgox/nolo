import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  //apiRoute: string = 'https://7q8hd2bw-3002.uks1.devtunnels.ms/';
  apiRoute: string = 'https://nolob.onrender.com/'

  login(username: string,password: string):Observable<any>{
    return this.http.post(`${this.apiRoute}users/login`,{username,password})
  }

}
