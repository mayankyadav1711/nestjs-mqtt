import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { mqttBroker } from '../mqtt-broker';

@Controller('user')
export class UserController {
  constructor() {
    mqttBroker.connect().then(() => {
      console.log('Server A: Connected to MQTT broker');
    });
  }

  @Get()
  async getUser(): Promise<any> {
    console.log('Server A: Received request for user');
    return new Promise((resolve, reject) => {
      const requestId = Date.now().toString();
      console.log(`Server A: Publishing user-details request with ID ${requestId}`);
      mqttBroker.publish('user-details/request', JSON.stringify({ requestId, action: 'get' }));

      const handler = (message: string) => {
        console.log('Server A: Received user details response');
        try {
          const response = JSON.parse(message);
          if (response.requestId === requestId) {
            console.log('Server A: Parsed user details', response.userDetails);
            mqttBroker.unsubscribe('user-details/response');
            resolve(response.userDetails);
          }
        } catch (error) {
          console.error('Server A: Failed to parse user details', error);
          mqttBroker.unsubscribe('user-details/response');
          reject(new HttpException('Failed to parse user details', HttpStatus.INTERNAL_SERVER_ERROR));
        }
      };

      console.log('Server A: Subscribing to user-details/response');
      mqttBroker.subscribe('user-details/response', handler);

      setTimeout(() => {
        console.log('Server A: Timeout reached waiting for user details');
        mqttBroker.unsubscribe('user-details/response');
        reject(new HttpException('Timeout waiting for user details', HttpStatus.REQUEST_TIMEOUT));
      }, 5000);
    });
  }
  
}