import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, MessageBody, WsResponse, ConnectedSocket  } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server;
    users: number = 0;
    info: any;

    async handleConnection() {

        // A client has connected
        this.users++;

        // Notify connected clients of current users
        this.server.emit('users', this.users);

    }

    async handleDisconnect() {

        // A client has disconnected
        this.users--;

        // Notify connected clients of current users
        this.server.emit('users', this.users);

    }

    @SubscribeMessage('chat')
    async handleEvent(@ConnectedSocket() client: any, @MessageBody() data: string) {
        const logger = new Logger('chat');
        const event = 'chat';
        const jenkins = require('jenkins')({ baseUrl: `http://${process.env.JENKINS_USER}:${process.env.JENKINS_PASS}@${process.env.JENKINS_HOST}:8091`, crumbIssuer: true });
        jenkins.info((err, data) => {
        if (err) { throw err; }
        this.server.emit(event, { name: 'jenkins', jobs: data.jobs , type: 'admin'});
      });
        this.server.emit(event, data);
    }
}
