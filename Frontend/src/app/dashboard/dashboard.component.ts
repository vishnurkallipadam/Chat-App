import { Component, OnInit } from '@angular/core';
import  io  from 'socket.io-client';
import { ChatService } from '../chat.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  msg:String='';
  messageArray:Array<{user:String,message:String,userID:String}> = [];

  constructor(private _chat:ChatService) { }

  ngOnInit(): void {
    
    this._chat.newMessageReceived()
        .subscribe(data =>          
          this.messageArray.push(data)
          );
  }

  sendMsg(){
    let loginmail=sessionStorage.getItem("loginmail");
    console.log(this.msg);
    this._chat.sendMessage({user:loginmail,  message:this.msg});
  }

  
}