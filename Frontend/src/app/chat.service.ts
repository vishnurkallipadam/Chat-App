import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket: Socket;

  server_address:String = 'http://localhost:5200';
  constructor(private http:HttpClient) { 
    this.socket = io('http://localhost:5200',{ transports: ['websocket','polling', 'flashback']})
  }

  sendMessage(data: any): void {
    this.socket.emit('message', data);
  }

  newMessageReceived(){
    let observable = new Observable<{user:String, message:String, userID:String}>(observer=>{
        this.socket.on('new message', (data:any)=>{
            observer.next(data);
        });
        return () => {this.socket.disconnect();}
    });

    return observable;
  }

  getUser(email:any){
    return this.http.get<any>(`${this.server_address}/getUsers`,email)
  }

  getGroups(){
    return this.http.get<any>(`${this.server_address}/getGroups`)
  }

  getSingleUser(id:any){
    return this.http.get<any>(`${this.server_address}/getUser/`+id)
  }

  chatHistory(item:any){
    return this.http.get<any>(`${this.server_address}/chatHistory/`+item);
  }

  groupChatHistory(item:any){
    return this.http.get<any>(`${this.server_address}/groupChatHistory/`+item);
  }



  sndprivatemsg(user:any,message:any,recepient:any,room:any){
   return this.socket.emit('sendindvmsg',{user:user,message:message,recepient:recepient,room:room});
  }

  sndprvtimg(user:any,image:any,recepient:any,room:any){
    return this.socket.emit('sendimage',{user:user,image:image,recepient:recepient,room:room});
  }

  blockUser(from:any,to:any){
    return this.http.post<any>(`${this.server_address}/blockUser`,{to,from}) 
  }

  unblockUser(from:any,to:any){
    return this.http.post<any>(`${this.server_address}/unBlockUser`,{to,from}) 
  }
  
  getBlockData(){
    return this.http.get<any>(`${this.server_address}/blockList`)
  }

  createGroup(name:any){
    console.log(name);
    return this.http.post<any>(`${this.server_address}/createGroup`,{name}) 
  }

  getSingleGroup(id:any){
    return this.http.get<any>(`${this.server_address}/getGroup/`+id)
  }

  joinGroup(mail:any,room:any){
    return this.http.post<any>(`${this.server_address}/joinGroup`,{mail,room})

  }

  sndgrpmsg(user:any,message:any,room:any){
    return this.socket.emit('sendgrpmsg',{user:user,message:message,room:room});
   }

   sndgrpimg(user:any,image:any,room:any){
     console.log(user);
     
    return this.socket.emit('sendgrpimage',{user:user,image:image,room:room});
  }

}