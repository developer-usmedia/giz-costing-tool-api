import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import { IAMMembers, Context } from '../interfaces';

export const setupJwtSecret = (
    ctx: Context,
    accounts: IAMMembers,
    secretData: pulumi.Input<string>,
) => {
    const jwtSecret = new gcp.secretmanager.Secret(`${ctx.prefix}-secret-jwt-secret`, {
        secretId: `${ctx.prefix}-secret-jwt-secret-${ctx.stack}`,
        replication: {auto: {}},
    });

    new gcp.secretmanager.SecretVersion(`${ctx.prefix}-secret-jwt-secret-data`, {
        secret: jwtSecret.id,
        secretData: secretData,
    });

    // Secret - Allow CloudRun
    new gcp.secretmanager.SecretIamMember(`${ctx.prefix}-secret-jwt-secret-allow-cloudrun`, {
        secretId: jwtSecret.id,
        role: 'roles/secretmanager.secretAccessor',
        member: pulumi.interpolate`${accounts.cloudrun.type}:${accounts.cloudrun.email}`,
    });

    return jwtSecret;
};
