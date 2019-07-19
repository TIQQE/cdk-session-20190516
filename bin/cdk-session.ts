#!/usr/bin/env node
import 'source-map-support/register';
import {App, Tag} from '@aws-cdk/core';
import { CdkSessionStack } from '../lib/cdk-session-stack';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

const app = new App();
const stack = new CdkSessionStack(app, 'CdkSessionStack');
stack.node.applyAspect(new Tag('Environment', 'Dev'));
stack.node.applyAspect(new Tag('Project', 'CDKDemo'));
stack.node.applyAspect(new Tag('CoolnessFactor', app.node.tryGetContext('coolness')));
const tagFilename = app.node.tryGetContext('tag_file');
const allTags = yaml.safeLoad(fs.readFileSync(tagFilename, 'utf-8'));
const myStage = 'test'; // This could be provided through context, in cdk.json and/or through command line options

const myTags = allTags[myStage];
for (let tagName in myTags) {
    stack.node.applyAspect(new Tag(tagName, myTags[tagName]));
}