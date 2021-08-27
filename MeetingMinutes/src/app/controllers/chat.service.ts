import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import { Message } from '../models/message.model';
import { environment } from '../../environments/environment'
import * as signalR from '@aspnet/signalr';

@Injectable()
export class ChatService {
  messageReceived = new EventEmitter<Message>();
  connectionEstablished = new EventEmitter<Boolean>();

  private connectionIsEstablished = false;
  private _hubConnection: HubConnection;
  baseUrl = environment.apiBaseUrl

  constructor() {
    this.createConnection();
    this.registerOnServerEvents();
    this.startConnection();
  }

  sendMessage(message: Message) {
    this._hubConnection.invoke('NewMessage', message);
  }

  private createConnection() {
    this._hubConnection = new HubConnectionBuilder()
    .withUrl("http://45.116.117.152:8099/hub/RequestLog")
      .configureLogging(LogLevel.Information)
      .build();
      // console.log(this._hubConnection)
  }

  private startConnection(): void {
    this._hubConnection
      .start()
      .then(() => {
        this.connectionIsEstablished = true;
        console.log('Hub connection started');
        this.connectionEstablished.emit(true);
      })
      .catch(err => {
        console.log('Error while establishing connection, retrying...');
        setTimeout(function () { this.startConnection(); }, 5000);
      });
  }

  private registerOnServerEvents(): void {
    this._hubConnection.on('MessageReceived', (data: any) => {
      this.messageReceived.emit(data);
    });
  }
}  