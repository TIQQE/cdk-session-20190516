import {Construct, Duration, RemovalPolicy, Stack, StackProps} from '@aws-cdk/core';
import {SubnetType, Vpc} from '@aws-cdk/aws-ec2';
import {AttributeType, BillingMode, StreamViewType, Table} from '@aws-cdk/aws-dynamodb';
import {Function, InlineCode, Runtime, StartingPosition} from '@aws-cdk/aws-lambda';
import {DynamoEventSource, S3EventSource} from '@aws-cdk/aws-lambda-event-sources';
import {Bucket, EventType} from '@aws-cdk/aws-s3';
import * as fs from 'fs';

export class CdkSessionStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, "MyVpc", {
      cidr: '10.0.0.0/16',
      maxAzs: 2,
      natGateways: 2
    });


    const dynamoTable = new Table(this, 'MyTable', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      tableName: this.node.tryGetContext('table_name'),
      stream: StreamViewType.NEW_IMAGE
    });

    const bucket = new Bucket(this, 'MyBucket', {
      bucketName: this.node.tryGetContext('bucket_name'),
      removalPolicy: RemovalPolicy.DESTROY   // Default is to retain bucket, but for this demo we delete bucket when stack is destroyed.
    });

    const s3func = new Function(this, 'MyS3Func', {
      code: new InlineCode(fs.readFileSync('functions/objecthandler.py', {encoding: 'utf-8'})),
      handler: 'index.lambda_handler',
      timeout: Duration.seconds(30),
      runtime: Runtime.PYTHON_3_7,
      logRetention: 14
    });

    const dynamofunc = new Function(this, 'MyDynamoDbFunc', {
      code: new InlineCode(fs.readFileSync('functions/dynamodbhandler.py', {encoding: 'utf-8'})),
      handler: 'index.lambda_handler',
      timeout: Duration.seconds(30),
      memorySize: 256,
      runtime: Runtime.PYTHON_3_7,
      logRetention: 30,
      vpc: vpc,
      vpcSubnets: { onePerAz: true, subnetType: SubnetType.PRIVATE}
    });

    s3func.addEventSource(new S3EventSource(bucket, {
      events: [ EventType.OBJECT_CREATED ]
    }));

    dynamofunc.addEventSource(new DynamoEventSource(dynamoTable, {
      startingPosition: StartingPosition.TRIM_HORIZON
    }));
  }
}
