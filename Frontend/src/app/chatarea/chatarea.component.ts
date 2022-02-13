import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../chat.service';
@Component({
  selector: 'app-chatarea',
  templateUrl: './chatarea.component.html',
  styleUrls: ['./chatarea.component.css','../dashboard/dashboard.component.css']
})
export class ChatareaComponent implements OnInit {
  imagemodel:any
  msg:String='';
  messageArray:Array<{user:String,message:String,userID:String,time:String,imgfile:string}> = [];
  user:any=[];
  room:any=''
  userBlocked=''
  isuserBlocked='';
  constructor(private chat:ChatService,) { }
  usermail:any='';
  id:any=''
  block:any=[]
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
            this.chat.getBlockData().subscribe((data)=>{
              this.block=JSON.parse(JSON.stringify(data))
              console.log(this.block);

              
            })
          })

        })
      })
     

    }

  }

  sendMsg(){
    this.userIsBlocked()
    if(this.isuserBlocked=='yes'){
      alert("you cant send msg to this user as you are blocked")
    }else if(this.msg!==''){
      this.chat.sndprivatemsg(this.usermail,this.msg,this.id,this.room)
      this.msg=''
    }
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

sendImage(){
  this.userIsBlocked()
  if(this.isuserBlocked=='yes'){
    alert("you cant send msg to this user as you are blocked")
  }else if(this.imageUrl!==''){
    this.chat.sndprvtimg(this.usermail,this.imageUrl,this.id,this.room)
    this.imagemodel='';
    this.imageUrl=''

  }

}


imageUrl:any='';
imagefile:any;
image:string=''
onFileSelected(event:any){
  if(event.target.files){
  
    var reader=new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload=(event:any)=>{
    this.imageUrl=reader.result;
    }
this.imagefile=<File>event.target.files[0];
  } 
 this.image=this.imagefile.name;
    }

    blockUser(user_email:any){
      console.log(user_email);
      console.log(this.usermail);
      this.chat.blockUser(this.usermail,user_email)
      .subscribe((data)=>{
        alert("USER BLOCKED!!")
      })
      
      
    }

    unblockUser(user_email:any){
      this.chat.unblockUser(this.usermail,user_email)
      .subscribe((data)=>{
        alert("USER UNBLOCKED!!")
        
      })
      
    }
    
    blockedUser(){
      for(let i of this.block){        
        if(i.from==this.usermail&&i.to==this.user.email){
          this.userBlocked="yes"
        }else{
          this.userBlocked=""
        }
      }
    }

    userIsBlocked(){
      for(let i of this.block){        
        if(i.to==this.usermail&&i.from==this.user.email){
          this.isuserBlocked="yes"
        }else{
          this.isuserBlocked=""
        }
      }
    }

    checkBlock(){
      this.blockedUser()
      return !!this.userBlocked
    }

}
