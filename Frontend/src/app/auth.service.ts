import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }
  server_address:String = 'http://localhost:5000';

  userSignup(user:any){
    return this.http.post<any>(`${this.server_address}/signup`,user)
  }

  userlogin(user:any){
    return this.http.post<any>(`${this.server_address}/login`,user)
  }


}
