import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import { IAMMembers, Context } from '../interfaces';

export const setupBrevoApiKeySecret = (
    ctx: Context,
    accounts: IAMMembers,
    secretData: pulumi.Input<string>,
) => {
    const brevoApiKey = new gcp.secretmanager.Secret(`${ctx.prefix}-secret-brevo-api-key`, {
        secretId: `${ctx.prefix}-secret-brevo-api-key-${ctx.stack}`,
        replication: {auto: {}},
    });

    new gcp.secretmanager.SecretVersion(`${ctx.prefix}-secret-brevo-api-key-data`, {
        secret: brevoApiKey.id,
        secretData: secretData,
    });

    // Secret - Allow CloudRun
    new gcp.secretmanager.SecretIamMember(`${ctx.prefix}-secret-brevo-api-key-allow-cloudrun`, {
        secretId: brevoApiKey.id,
        role: 'roles/secretmanager.secretAccessor',
        member: pulumi.interpolate`${accounts.cloudrun.type}:${accounts.cloudrun.email}`,
    });

    return brevoApiKey;
};
