# Useful commands

This is sample CDK application with a single stack.

# Getting started

- Install AWS CDK using "npm install -g aws-cdk"
- Run "npm install" in repo root directory to install the packages
- Modify bucket_name and table_name in cdk.json to suitable names
- Run "npm run build" to compile the code (remember to do this whenever there is a code change! or use "npm run watch")
- Switch/fix the "default" AWS profile to be the profile you want to use (profile management is not quite working properly)
- Run "cdk bootstrap" to bootstrap the account for CDK usage
- Run "cdk deploy" to deploy the demo to some AWS account
- Run "cdk destroy" to delete the stack. This works even if the stack never was created properly in the first place.


 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

