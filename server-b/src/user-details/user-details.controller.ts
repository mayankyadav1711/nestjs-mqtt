import { Controller, OnModuleInit } from '@nestjs/common';
import { mqttBroker } from '../mqtt-broker';

@Controller('user-details')
export class UserDetailsController implements OnModuleInit {
  async onModuleInit() {
    console.log('Server B: Initializing UserDetailsController');
    try {
      await mqttBroker.connect();
      console.log('Server B: Connected to MQTT broker');
      
      mqttBroker.subscribe('user-details/request', (message) => {
        console.log('Server B: Received request for user details', message);
        const request = JSON.parse(message);
        const userDetails = this.getUserDetails();
        console.log('Server B: Sending user details', userDetails);
        mqttBroker.publish('user-details/response', JSON.stringify({
          requestId: request.requestId,
          userDetails
        }));
      });
      console.log('Server B: Subscribed to user-details/request');
    } catch (error) {
      console.error('Server B: Failed to initialize MQTT connection', error);
    }
  }

  private getUserDetails() {
    return {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com>>>>>>',
      age: 30,
    };
  }
}