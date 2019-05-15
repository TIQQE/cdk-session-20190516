#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/cdk');
import { CdkSessionStack } from '../lib/cdk-session-stack';

const app = new cdk.App();
new CdkSessionStack(app, 'CdkSessionStack');
