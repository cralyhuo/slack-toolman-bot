import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, MessageBody, WsResponse, ConnectedSocket  } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server;
    users: number = 0;
    info: any;
    jobs: any[];
    jobName: string;

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
    async handleEvent(@ConnectedSocket() client: any, @MessageBody() data: any) {
        const logger = new Logger('chat');
        const event = 'chat';
        const jenkins = require('jenkins')({ baseUrl: `http://${process.env.JENKINS_USER}:${process.env.JENKINS_PASS}@${process.env.JENKINS_HOST}:8091`, crumbIssuer: true });
        if (data.text === '/list') {
            jenkins.info((err, data) => {
                if (err) { throw err; }
                this.jobs = data.jobs;
                this.server.emit(event, { name: 'jenkins', jobs: data.jobs , type: 'admin'});
              });
        }
        if (data.text.includes('/build')) {
          this.jobName =  data.text.slice(6, data.text.length);
          this.jobs.forEach(i => {
            logger.log(i.name, this.jobName);
          });
          const job = this.jobs.find(i => i.name === this.jobName);
          logger.log(job);
          jenkins.job.build({ name: job.url, parameters: { Branch: 'test' } }, (err, data) => {
             logger.log(err, data);
             if (err) {
                return this.server.emit(event, { name: 'jenkins', text: 'err' });
             }
             this.server.emit(event, { name: 'jenkins', text: 'success' });
          });
      }
        this.server.emit(event, data);
    }
}
