import * as gcp from '@pulumi/gcp';
import { Context } from '../interfaces';

export const setupCloudrunAccount = (
    ctx: Context,
) => {
    return new gcp.serviceaccount.Account(`${ctx.prefix}-svc-cloudrun-${ctx.stack}`, {
        accountId: `svc-cloudrun-${ctx.stack}`,
        displayName: `Cloud Run (API - ${ctx.stack})`,
        description: `Service Account used by Cloud Run (API - ${ctx.stack})`,
    });
};
