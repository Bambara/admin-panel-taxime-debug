import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

    // Our socket connection
    private socket;
    public enableDriversCount;

    constructor() { }

    socketHandle() {
        this.socket = io(environment.admin_socket_url);

        this.socket.emit('adminConnected', { adminId: localStorage.getItem('userId') });

        this.socket.on('toEnableDriversCount', (data) => {
            this.enableDriversCount = data.length;
            //console.log("pending count from socket: "+this.enableDriversCount);
            localStorage.setItem('enableDriversCount', this.enableDriversCount)
            // console.log(this.enableDriversCount);
            this.notificationChannel(this.enableDriversCount);
        });

        this.socket.on('toClient', (data) => {
            var toEnableDriverCount = parseInt( localStorage.getItem('enableDriversCount'));
            toEnableDriverCount++;
            
            localStorage.setItem('enableDriversCount', toEnableDriverCount.toString());
        });

    }

    channel = new BroadcastChannel('NotificationChannel');

    notificationChannel(count){
        this.channel.postMessage({count : count});
    }

}
