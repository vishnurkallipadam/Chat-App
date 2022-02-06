import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../chat.service';
import { DashboardComponent } from '../dashboard/dashboard.component'; 

@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.css','../dashboard/dashboard.component.css']
})
export class ChatlistComponent implements OnInit {
  user:any=[]
  email:any=''
  count:any=0
  
  constructor(private chat:ChatService,private router:DashboardComponent) { }

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
    this.router.ngOnInit()
    
    
    

  }

}
