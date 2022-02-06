import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ChatService } from '../chat.service';


@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.css','../dashboard/dashboard.component.css']
})
export class ChatlistComponent implements OnInit {
  user:any=[]
  email:any=''
  count:any=0
  
  constructor(private chat:ChatService,private router:Router,private auth:AuthService) { }

  ngOnInit(): void {
    
      this.email=sessionStorage.getItem('email')
      this.chat.getUser(this.email).subscribe((data)=>{
        console.log(data);
        
        this.user=JSON.parse(JSON.stringify(data))
        console.log(this.user);
        this.count=this.user.length-1
        console.log(this.count);
        
      })


    
  }

  chatUser(user:any){
    console.log(user);
    sessionStorage.setItem('chatUser',user._id)
   window.location.reload();
  }

  // logout user
  logoutUser(){

    this.email =sessionStorage.getItem("email");

    this.auth.logOut(this.email)
    console.log(this.email);
    sessionStorage.clear()
    this.router.navigate(['/'])
  }

}
