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
  flag:any=''
  grpid:any=''
  group={
    name:'',
    members:[]
  };
  ingroup:any=''
  ngOnInit(): void {
   
    this.flag=sessionStorage.getItem('chat')
    if(this.flag=="private"){
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
  
              })
            })
  
          })


        },1000)


       
  
      }
    }else if(this.flag=="group"){
      this.grpid=sessionStorage.getItem('chatGroup')
      if(this.grpid){
        setInterval(()=>{
          this.chat.getSingleGroup(this.grpid).subscribe((data)=>{
            this.group=JSON.parse(JSON.stringify(data))
            this.usermail=sessionStorage.getItem('email')
            this.inGroup()
            var inside=sessionStorage.getItem('ingrp')
            // console.log(inside);
            

            
            if(this.ingroup=='yes'){
              this.chat.groupChatHistory(this.group.name)
              .subscribe((data)=>{
                this.messageArray=JSON.parse(JSON.stringify(data))
              })
            }
  
          })
        },1000)

      }
      

    }



  }

  forwrdmessage:any=''
  sendMsg(){
    this.userIsBlocked()
    this.blockedUser()
    this.forwrdmessage=sessionStorage.getItem('forward message')
  if(this.forwrdmessage){
    this.chat.sndprivatemsg(this.usermail,this.forwrdmessage,this.id,this.room)
    this.imagemodel='';
    this.imageUrl=''
    sessionStorage.removeItem('forward img')
    sessionStorage.removeItem('forward message')

  }else if(this.userBlocked=='yes'){
      alert("you had blocked this user")
    } else if(this.isuserBlocked=='yes'){
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
forwrdImgurl:any=''
sendImage(){
  this.userIsBlocked()
  this.blockedUser()
  this.forwrdImgurl=sessionStorage.getItem('forward img')
  if(this.forwrdImgurl){
    this.chat.sndprvtimg(this.usermail,this.forwrdImgurl,this.id,this.room)
    this.imagemodel='';
    this.imageUrl=''
    sessionStorage.removeItem('forward img')
    sessionStorage.removeItem('forward message')

  }else if(this.userBlocked=='yes'){
    alert("you had blocked this user")
  } else if(this.isuserBlocked=='yes'){
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
        window.location.reload()
        
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

    checkPrivate(){
        return sessionStorage.getItem('private')
    }

    checkGroup(){
      return sessionStorage.getItem('group')
    }

    inGroup(){    
      
      
            this.ingroup=''
            let members=this.group.members 
            for (let i of members){
              if(i==this.usermail){
                this.ingroup='yes'
                
              }
            }

    }

    checkinsideGroup(){
      this.inGroup()
      return !!this.ingroup
    }

    joinGroup(data:any){
      console.log(data);
      console.log(this.usermail);
      this.chat.joinGroup(this.usermail,data._id).subscribe(
        data=>{
          alert("joined to Group")
        }
      )
      

    }

    sendGroupImage(){
      this.forwrdImgurl=sessionStorage.getItem('forward img')
      if(this.forwrdImgurl){
        this.chat.sndgrpimg(this.usermail,this.forwrdImgurl,this.group.name)
        this.imagemodel='';
        this.imageUrl=''
        sessionStorage.removeItem('forward img')
        sessionStorage.removeItem('forward message')
    
      }else if(this.ingroup=='yes'){
        if(this.imageUrl!==''){
    this.chat.sndgrpimg(this.usermail,this.imageUrl,this.group.name)
    this.imagemodel='';
    this.imageUrl=''

  }
        }else {
        alert("you cant send msg to this group!! Please join to send message")
      }
    }

    

    sendGroupMsg(){
      this.forwrdmessage=sessionStorage.getItem('forward message')
  if(this.forwrdmessage){
    this.chat.sndgrpmsg(this.usermail,this.forwrdmessage,this.group.name)
    this.imagemodel='';
    this.imageUrl=''
    sessionStorage.removeItem('forward img')
    sessionStorage.removeItem('forward message')

  }else if(this.ingroup=='yes'){
        if(this.msg!==''){
          this.chat.sndgrpmsg(this.usermail,this.msg,this.group.name)
          this.msg=''
        }
        }else {
        alert("you cant send msg to this group!! Please join to send message")
      }
    }

    muteArray:any=[]
    muteUser(email:any){
      this.muteArray.push(email)
      console.log(this.muteArray);
    }
    isuserMuted:any=''

    userMuted(){
      for(let i of this.muteArray){        
        if(i==this.user.email){
          this.isuserMuted="yes"
        }else{
          this.isuserMuted=''
        }
      }

    }

    checkMute(){
      this.userMuted()
      return !!this.isuserMuted
    }

    unmuteUser(user:any){
      const index = this.muteArray.indexOf(user);
      if (index > -1) {
      this.muteArray.splice(index, 1); // 2nd parameter means remove one item only
     }
     this.userMuted()
     console.log(this.isuserMuted);
     window.location.reload()
    
     
    }

    forwardMsg(item:any){
      if(item.imgfile){
        sessionStorage.setItem('forward img',item.imgfile.toString())
        alert("Please select the contact where you want to forward message")

      }else if(item.message){
        sessionStorage.setItem('forward message',item.message.toString())
        alert("Please select the contact where you want to forward message")


      }
    }

    leaveGroup(group:any){
      console.log(this.usermail);
      this.chat.leftGroup(this.usermail,group._id).subscribe(
        data=>{
          alert("Left Group")
          window.location.reload()
        }
      )
      

    }

}
