import AWS from 'aws-sdk';
import uuid from 'uuid';
import { SNS, OK, ERROR } from 'node-lambda-events';

import { MESSAGE_TABLE, REGION } from '../global';

const BATCH_WRITE = 'batchWrite';

export default SNS.wrap(class extends SNS {
  async perform() {
    try {
      const items = this.records.map(this.each, this);
      await this.dynamoDB(BATCH_WRITE, { RequestItems: { [MESSAGE_TABLE]: items } });
      this.respond(OK);
    } catch (err) {
      this.respond(ERROR, err.toString());
    }
  }

  each(record) {
    const { body } = record.body;
    return {
      PutRequest: {
        Item: {
          id: uuid.v4(),
          message: body,
        },
      },
    };
  }

  dynamoDB(op, params) {
    return new Promise((resolve, reject) => {
      this.client[op](params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  get client() {
    return new AWS.DynamoDB.DocumentClient({ region: REGION });
  }
});
