import * as gcp from '@pulumi/gcp';
import { Context } from '../interfaces';

export const setupApiBackendService = (
    ctx: Context,
) => {
    const apiNeg = new gcp.compute.RegionNetworkEndpointGroup(`${ctx.prefix}-api-neg-${ctx.stack}`, {
        name: `${ctx.prefix}-api-neg-${ctx.stack}`,
        networkEndpointType: 'SERVERLESS',
        region: ctx.region,
        cloudRun: { service: `${ctx.prefix}-api-${ctx.stack}` }, // Needs to match name from other stack
    });

    const apiBackendService = new gcp.compute.BackendService(`${ctx.prefix}-api-service-${ctx.stack}`, {
        name: `${ctx.prefix}-api-service-${ctx.stack}`,
        protocol: 'HTTPS',
        enableCdn: false,
        backends: [
            { group: apiNeg.id },
        ],
        logConfig: { enable: false, sampleRate: 1 },
    });

    return apiBackendService;
};
