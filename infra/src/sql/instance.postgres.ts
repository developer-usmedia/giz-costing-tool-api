import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import { Context } from '../interfaces';

export const getPostgresInstance = (
    ctx: Context,
    stack: pulumi.StackReference,
) => {
    return gcp.sql.DatabaseInstance.get(`${ctx.prefix}-postgres`, stack.getOutput('dbInstanceId'));
};

export const setupPostgresInstance = (
    ctx: Context,
    adminPassword: pulumi.Input<string>,
) => {
    const instance = new gcp.sql.DatabaseInstance(`${ctx.prefix}-postgres`, {
        name: `${ctx.prefix}-postgres`,
        databaseVersion: 'POSTGRES_15',
        region: ctx.region,
        settings: {
            edition: 'ENTERPRISE',
            tier: 'db-g1-small',
            diskSize: 20,
            diskAutoresize: true,
            deletionProtectionEnabled: true,
            backupConfiguration: {
                enabled: true,
                startTime: '01:00',
                backupRetentionSettings: { retainedBackups: 7 },
            },
        },
    });

    new gcp.sql.User(`${ctx.prefix}-database-admin-user`, {
        instance: instance.name,
        type: 'BUILT_IN',
        name: `${ctx.prefix}_admin`,
        password: adminPassword,
    });

    return instance;
};
