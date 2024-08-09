import * as mqtt from 'mqtt';

class MqttBroker {
  private static instance: MqttBroker;
  private client: mqtt.MqttClient;

  private constructor() {
    console.log('MQTT Broker: Instance created');
  }

  public static getInstance(): MqttBroker {
    if (!MqttBroker.instance) {
      MqttBroker.instance = new MqttBroker();
    }
    return MqttBroker.instance;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client = mqtt.connect('mqtt://broker.hivemq.com:1883');
      this.client.on('connect', () => {
        console.log('MQTT Broker: Connected to HiveMQ');
        resolve();
      });
      this.client.on('error', (error) => {
        console.error('MQTT Broker: Connection error', error);
        reject(error);
      });
    });
  }

  publish(topic: string, message: string): void {
    console.log(`MQTT Broker: Publishing to ${topic}`, message);
    this.client.publish(topic, message);
  }

  subscribe(topic: string, callback: (message: string) => void): void {
    console.log(`MQTT Broker: Subscribing to ${topic}`);
    this.client.subscribe(topic);
    this.client.on('message', (receivedTopic, message) => {
      if (receivedTopic === topic) {
        callback(message.toString());
      }
    });
  }

  unsubscribe(topic: string): void {
    console.log(`MQTT Broker: Unsubscribing from ${topic}`);
    this.client.unsubscribe(topic);
  }
}

export const mqttBroker = MqttBroker.getInstance();