import {Construct, Stack, StackProps} from '@aws-cdk/cdk';
import {SubnetType, VpcNetwork} from '@aws-cdk/aws-ec2';
import {AttributeType, BillingMode, StreamViewType, Table} from '@aws-cdk/aws-dynamodb';
import {Function, InlineCode, Runtime, StartingPosition} from '@aws-cdk/aws-lambda';
import {DynamoEventSource, S3EventSource} from '@aws-cdk/aws-lambda-event-sources';
import {Bucket, EventType} from '@aws-cdk/aws-s3';
import * as fs from 'fs';

export class CdkSessionStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new VpcNetwork(this, "MyVpc", {
      cidr: '10.0.0.0/16',
      maxAZs: 2,
      natGateways: 2
    });


    const dynamoTable = new Table(this, 'MyTable', {
      partitionKey: {
        name: 'id',
        type: AttributeType.String
      },
      billingMode: BillingMode.PayPerRequest,
      tableName: 'cdk-session-table',
      streamSpecification: StreamViewType.NewImage
    });

    const bucket = new Bucket(this, 'MyBucket', {
      bucketName: 'cdk-session-bucket4711'
    });

    const s3func = new Function(this, 'MyS3Func', {
      code: new InlineCode(fs.readFileSync('functions/objecthandler.py', {encoding: 'utf-8'})),
      handler: 'index.lambda_handler',
      timeout: 30,
      runtime: Runtime.Python37,
      logRetentionDays: 10
    });

    const dynamofunc = new Function(this, 'MyDynamoDbFunc', {
      code: new InlineCode(fs.readFileSync('functions/dynamodbhandler.py', {encoding: 'utf-8'})),
      handler: 'index.lambda_handler',
      timeout: 30,
      memorySize: 256,
      runtime: Runtime.Python37,
      logRetentionDays: 30,
      vpc: vpc,
      vpcSubnets: { onePerAz: true, subnetType: SubnetType.Private}
    });

    s3func.addEventSource(new S3EventSource(bucket, {
      events: [ EventType.ObjectCreated ]
    }));

    dynamofunc.addEventSource(new DynamoEventSource(dynamoTable, {
      startingPosition: StartingPosition.TrimHorizon
    }));
  }
}
