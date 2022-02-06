import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }
  server_address:String = 'http://localhost:5200';

  userSignup(user:any){
    return this.http.post<any>(`${this.server_address}/signup`,user)
  }

  userlogin(user:any){
    return this.http.post<any>(`${this.server_address}/login`,user)
  }

  userLoggedIn(){
    return !!sessionStorage.getItem('user')
  }

  logOut(user:any){
    console.log(user)
    return this.http.get<any>(`${this.server_address}/logout/`+user)
    .subscribe(
      res=>{
        console.log(res);
        
      },
      err=>{
        console.log(err);
        
      }
    )
  }


}
