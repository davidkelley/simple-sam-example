import AWS from 'aws-sdk';
import { Schedule, OK, ERROR } from 'node-lambda-events';

import { SNS_TOPIC, REGION } from '../global';

const PUBLISH = 'publish';

export default Schedule.wrap(class extends Schedule {
  async perform() {
    try {
      const message = { body: 'Hello Sam!' };
      await this.publish(message);
      this.respond(OK);
    } catch (err) {
      this.respond(ERROR, err.toString());
    }
  }

  publish(payload) {
    const params = { TopicArn: SNS_TOPIC, Message: JSON.stringify(payload) };
    return this.sns(PUBLISH, params);
  }

  sns(op, params) {
    return new Promise((resolve, reject) => {
      new AWS.SNS({ region: REGION })[op](params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
});
