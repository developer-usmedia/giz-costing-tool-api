import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import { Context, IAMMembers } from '../interfaces';

export const setupDatabase = (
    ctx: Context,
    accounts: IAMMembers,
    instanceName: pulumi.Input<string>,
    username: pulumi.Input<string>,
    password: pulumi.Input<string>,
) => {
    // new gcp.projects.IAMMember(`${ctx.prefix}-database-allow-cloudrun`, {
    //     project: ctx.project,
    //     member: pulumi.interpolate`${accounts.cloudrun.type}:${accounts.cloudrun.email}`,
    //     role: 'roles/cloudsql.client',
    // });

    new gcp.sql.User(`${ctx.prefix}-database-user`, {
        instance: instanceName,
        type: 'BUILT_IN',
        name: username,
        password: password,
    });

    return new gcp.sql.Database(`${ctx.prefix}-database`, {
        instance: instanceName,
        name: `${ctx.prefix}-${ctx.stack}`,
    });
}
