import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
@Component({
  selector: 'app-chatarea',
  templateUrl: './chatarea.component.html',
  styleUrls: ['./chatarea.component.css','../dashboard/dashboard.component.css']
})
export class ChatareaComponent implements OnInit {
  msg:String='';
  messageArray:Array<{user:String,message:String,userID:String}> = [];
  user:any=[]
  constructor(private chat:ChatService) { }

  ngOnInit(): void {
    let id = sessionStorage.getItem('chatUser')
    this.chat.getSingleUser(id).subscribe((data)=>{
      this.user=JSON.parse(JSON.stringify(data))
    })
    this.chat.newMessageReceived()
    .subscribe(data =>          
      this.messageArray.push(data)
      );
  }

  sendMsg(){
    let loginmail=sessionStorage.getItem("loginmail");
    console.log(this.msg);
    this.chat.sendMessage({user:loginmail,  message:this.msg});
  }

  refresh(){
    this.ngOnInit()
  }
}
