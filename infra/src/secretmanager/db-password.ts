import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import { IAMMembers, Context } from '../interfaces';

export const setupDBPasswordSecret = (
    ctx: Context,
    accounts: IAMMembers,
    secretData: pulumi.Input<string>,
) => {
    const dbPassword = new gcp.secretmanager.Secret(`${ctx.prefix}-secret-db-pass`, {
        secretId: `${ctx.prefix}-secret-db-password-${ctx.stack}`,
        replication: {auto: {}},
    });

    new gcp.secretmanager.SecretVersion(`${ctx.prefix}-secret-db-pass-data`, {
        secret: dbPassword.id,
        secretData: secretData,
    });

    // Secret - Allow CloudRun
    new gcp.secretmanager.SecretIamMember(`${ctx.prefix}-secret-db-pass-allow-cloudrun`, {
        secretId: dbPassword.id,
        role: 'roles/secretmanager.secretAccessor',
        member: pulumi.interpolate`${accounts.cloudrun.type}:${accounts.cloudrun.email}`,
    });

    return dbPassword;
};
