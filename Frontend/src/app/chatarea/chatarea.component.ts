import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../chat.service';
@Component({
  selector: 'app-chatarea',
  templateUrl: './chatarea.component.html',
  styleUrls: ['./chatarea.component.css','../dashboard/dashboard.component.css']
})
export class ChatareaComponent implements OnInit {

  msg:String='';
  messageArray:Array<{user:String,message:String,userID:String,time:String}> = [];
  user:any=[];
  room:any=''
  constructor(private chat:ChatService,) { }
  usermail:any='';
  id:any=''
  ngOnInit(): void {
    this.id = sessionStorage.getItem('chatUser')
    if(this.id){
      setInterval(()=>{
        this.chat.getSingleUser(this.id).subscribe((data)=>{
          this.user=JSON.parse(JSON.stringify(data))
          this.usermail=sessionStorage.getItem('email')
          this.room=(this.createRoomName(this.user.email, this.usermail));
          this.chat.chatHistory(this.room)
          .subscribe((data)=>{
            this.messageArray=JSON.parse(JSON.stringify(data))
            // var elem = document.getElementById('commentbox');
            // elem.scrollTop = elem.scrollHeight;
          })

        })
      })

    }

  }

  sendMsg(){
    this.chat.sndprivatemsg(this.usermail,this.msg,this.id,this.room)
    this.msg=''
    
  }

  refresh(){
    this.ngOnInit()
  }

 createRoomName(id1:any, id2:any) {
    // make sure id1 is the smaller value for
    // consistency of generation
    if (id1 > id2) {
        // swap two values
        let temp = id2;
        id2 = id1;
        id1 = temp;
    }
    return id1.toString(10).padStart(10, "0") + id2.toString(10).padStart(10, "0");
}


}
