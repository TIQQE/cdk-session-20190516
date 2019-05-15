#!/usr/bin/env node
import 'source-map-support/register';
import {App, Tag} from '@aws-cdk/cdk';
import { CdkSessionStack } from '../lib/cdk-session-stack';

const app = new App();
const stack = new CdkSessionStack(app, 'CdkSessionStack');
stack.node.apply(new Tag('Environment', 'Dev'));
stack.node.apply(new Tag('Project', 'CDKDemo'));


