# Simple SAM Example

Serves as a very simple demonstration project for [AWS SAM](https://github.com/awslabs/serverless-application-model). It also includes a [pipeline cloudformation](/pipeline.yml), demonstrating how you can easily integrate SAM projects into [CodePipeline](https://aws.amazon.com/documentation/codepipeline/) and [CodeBuild](https://aws.amazon.com/documentation/codebuild/).

The project consists of two functions, a [publisher](/functions/publisher/publisher.js) and a [receiver](/functions/receiver/receiver.js). The publisher function sends a `Hello Sam!` message to an SNS Topic at a defined interval. This message is subsequently received by the receiver function and the message is saved to a DynamoDB Table, alongside a randomly generated UUID.

_Note: In-order to abstract away a lot of the request & response handling, the [node-lambda-events](https://github.com/notonthehighstreet/node-lambda-events) library has been included in the project._
