'use strict';

import AWS from 'aws-sdk-mock';
import faker from 'faker';
import fs from 'fs';

process.env.MESSAGE_TABLE = "some-dynamodb-table";

const mod = require('../../../handler');

const jestPlugin = require('serverless-jest-plugin');

const lambdaWrapper = jestPlugin.lambdaWrapper;

const wrapped = lambdaWrapper.wrap(mod, { handler: 'receiver' });

describe('λ.receiver', () => {
  describe('when a message is received', () => {
    const messageGenerator = () => {
      return JSON.stringify({ body: 'Hello World!' });
    };

    const recordGenerator = () => {
      return {
        EventVersion: "1.0",
        EventSubscriptionArn: "arn:aws:sns:...",
        EventSource: "aws:sns",
        Sns: {
          SignatureVersion: "1",
          Timestamp: new Date().toString(),
          Signature: "EXAMPLE",
          SigningCertUrl: faker.internet.url(),
          MessageId: faker.random.uuid(),
          Message: messageGenerator(),
          MessageAttributes: {
            [faker.random.word()]: {
              Type: "String",
              Value: faker.random.words()
            }
          },
          Type: "Notification",
          UnsubscribeUrl: faker.internet.url(),
          TopicArn: "aws:arn:sns:...",
          Subject: "Invoke"
        }
      }
    };

    const payloadGenerator = (n) => {
      const Records = [];
      Array(n).fill(n).forEach(() => { Records.push(recordGenerator()) });
      return { Records };
    };

    const mockBatchWrite = jest.fn().mockImplementation((params, cb) => {
      return cb(null, {});
    });

    beforeAll(() => {
      AWS.mock('DynamoDB.DocumentClient', 'batchWrite', mockBatchWrite);
    });

    it('creates the expected record', async () => {
      const payload = payloadGenerator(1);

      const response = await wrapped.run(payload);

      expect(mockBatchWrite).toHaveBeenCalledWith(expect.objectContaining({
        RequestItems: {
          [process.env.MESSAGE_TABLE]: [{
            PutRequest: {
              Item: {
                id: expect.any(String),
                message: expect.any(String),
              }
            }
          }],
        },
      }), expect.any(Function));
    });

    afterAll(() => {
      AWS.restore('DynamoDB.DocumentClient', 'batchWrite');
    });
  });
});
