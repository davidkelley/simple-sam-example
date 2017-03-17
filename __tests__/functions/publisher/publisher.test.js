'use strict';

import AWS from 'aws-sdk-mock';
import faker from 'faker';

process.env.SNS_TOPIC = "arn:aws:sns:...";

const mod = require('../../../handler');

const jestPlugin = require('serverless-jest-plugin');

const lambdaWrapper = jestPlugin.lambdaWrapper;

const wrapped = lambdaWrapper.wrap(mod, { handler: 'publisher' });

describe('λ.publisher', () => {
  describe('when the function is invoked', () => {
    const mockSNSPublish = jest.fn().mockImplementation((params, cb) => {
      return cb(null, {});
    });

    beforeAll(() => {
      AWS.mock('SNS', 'publish', mockSNSPublish);
    });

    it('should publish the correct message', async () => {
      const response = await wrapped.run({});
      expect(mockSNSPublish).toHaveBeenCalledWith(expect.objectContaining({
        TopicArn: process.env.SNS_TOPIC,
        Message: JSON.stringify({ body: 'Hello World!' }),
      }), expect.any(Function))
    });

    afterAll(() => {
      AWS.restore('SNS', 'publish');
    });
  });
});
