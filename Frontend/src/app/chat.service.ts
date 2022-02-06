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
  getSingleUser(id:any){
    return this.http.get<any>(`${this.server_address}/getUser/`+id)
  }

  chatHistory(item:any){
    console.log(item)
    return this.http.get<any>(`${this.server_address}/chatHistory/`+item);
  }

  sndprivatemsg(user:any,message:any,recepient:any,room:any){
   return this.socket.emit('sendindvmsg',{user:user,message:message,recepient:recepient,room:room});
  }
  
}