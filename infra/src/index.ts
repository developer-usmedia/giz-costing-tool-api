import * as pulumi from '@pulumi/pulumi';

import { Context, IAMMembers } from './interfaces';
import { setupCloudrunAccount, } from './serviceaccount';
import { setupApiCloudrun } from './cloudrun';
import { setupBrevoApiKeySecret, setupDBPasswordSecret, setupJwtSecret } from './secretmanager';
import { getPostgresInstance, setupDatabase, setupPostgresInstance } from './sql';

// TODO: UsMedia Groups Access where needed

//
// Setup
//
const projectConfig = new pulumi.Config('project');
const gcpConfig = new pulumi.Config('gcp');
const dbConfig = new pulumi.Config('db');
const cloudrunConfig = new pulumi.Config('cloudrun');
const apiConfig = new pulumi.Config('api');

const ctx: Context = {
    organization: pulumi.getOrganization(),
    project: pulumi.getProject(),
    stack: pulumi.getStack(),
    region: gcpConfig.require('region'),
    prefix: projectConfig.require('prefix', { minLength: 3, maxLength: 15 }),
    number: projectConfig.require('number'),
};
const prodStack = new pulumi.StackReference(`${ctx.organization}/${ctx.project}/production`);

//
// Service Accounts
//
const svcCloudrun = setupCloudrunAccount(ctx);

const accounts: IAMMembers = {
    cloudrun: { type: 'serviceAccount', email: svcCloudrun.email },
    usAdmin: { type: 'group', email: 'iam-gcp-admin@usmedia.nl' },
    usDevelopers: { type: 'group', email: 'iam-gcp-developers@usmedia.nl' },
    usDevops: { type: 'group', email: 'iam-gcp-devops@usmedia.nl' },
    usMonitoring: { type: 'group', email: 'iam-gcp-monitoring@usmedia.nl' },
    usSecurity: { type: 'group', email: 'iam-gcp-security@usmedia.nl' },
};

//
// Secrets
//
const dbPasswordSecret = setupDBPasswordSecret(ctx, accounts, dbConfig.requireSecret('password'));
const brevoApiKeySecret = setupBrevoApiKeySecret(ctx, accounts, apiConfig.requireSecret('brevo-api-key'));
const jwtSecret = setupJwtSecret(ctx, accounts, apiConfig.requireSecret('jwt-secret'));

//
// Database
//
const dbInstance = (ctx.stack === 'production'
    ? setupPostgresInstance(ctx, dbConfig.requireSecret('admin-password'))
    : getPostgresInstance(ctx, prodStack));

const database = setupDatabase(
    ctx,
    accounts,
    dbInstance.name,
    dbConfig.requireSecret('username'),
    dbConfig.requireSecret('password'),
);

//
// Cloudrun
//
const dockerContainer = cloudrunConfig.require('container');
const envVars =  [
    { name: 'ENV',                      value: apiConfig.require('env') },
    { name: 'LOG_LEVEL',                value: apiConfig.require('log-level')},
    { name: 'API_URL',                  value: apiConfig.require('url') },
    { name: 'API_PORT',                 value: '80' },
    { name: 'API_CORS_ORIGIN',          value: apiConfig.require('cors-origin') },
    { name: 'DB_SOCKET',                value: pulumi.interpolate`/cloudsql/${dbConfig.require('connection-name')}` },
    { name: 'DB_NAME',                  value: dbConfig.require('name') },
    { name: 'DB_USER',                  value: dbConfig.requireSecret('username') },
    { name: 'DB_PASSWORD',              valueSource: { secretKeyRef: { secret: dbPasswordSecret.secretId, version: 'latest' } } },
    { name: 'BREVO_API_KEY',            valueSource: { secretKeyRef: { secret: brevoApiKeySecret.secretId, version: 'latest' } } },
    { name: 'JWT_SECRET',               valueSource: { secretKeyRef: { secret: jwtSecret.secretId, version: 'latest' } } },
    { name: 'JWT_EXPIRES_IN',           value: '1h' },
    { name: 'JWT_REFRESH_EXPIRES_IN',   value: '4d' },
    { name: 'EMAIL_FROM_NAME',          value: apiConfig.require('email-from-name') },
    { name: 'EMAIL_FROM_ADDRESS',       value: apiConfig.require('email-from-address') },
];

const cloudrun = setupApiCloudrun(
    ctx,
    accounts,
    cloudrunConfig.requireNumber('min-instances'),
    cloudrunConfig.requireNumber('max-instances'),
    dockerContainer,
    dbConfig.require('connection-name'),
    envVars,
);

//
// Export - Stack references
//
export const cloudrunId = cloudrun.id;
export const container = dockerContainer;
export const dbInstanceId = dbInstance.id;
