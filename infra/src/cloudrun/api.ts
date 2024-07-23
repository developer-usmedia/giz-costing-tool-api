import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import { IAMMembers, Context } from '../interfaces';

/**
 * Note `sqlConnectionName` has maximum socket path length of 108 characters
 */
export const setupApiCloudrun = (
    ctx: Context,
    accounts: IAMMembers,
    minCount: pulumi.Input<number>,
    maxCount: pulumi.Input<number>,
    containerImage: pulumi.Input<string>,
    sqlConnectionName: pulumi.Input<string>,
    envVars: pulumi.Input<pulumi.Input<gcp.types.input.cloudrunv2.ServiceTemplateContainerEnv>[]>
) => {
    const cloudrun = new gcp.cloudrunv2.Service(`${ctx.prefix}-api`, {
        name: `${ctx.prefix}-api-${ctx.stack}`,
        location: ctx.region,
        ingress: 'INGRESS_TRAFFIC_ALL',
        template: {
            serviceAccount: accounts.cloudrun.email,
            scaling: { minInstanceCount: minCount, maxInstanceCount: maxCount },
            volumes: [{ name: 'cloudsql',  cloudSqlInstance: { instances: [ sqlConnectionName ] } }],
            timeout: '60s',
            containers: [{
                image: containerImage,
                ports: [{ containerPort: 80 }],
                envs: envVars,
                resources: {
                    cpuIdle: true,
                    startupCpuBoost: false,
                    limits: { cpu: '1', memory: '1Gi' },
                },
                startupProbe: {
                    httpGet: { path: '/health/readiness', port: 80 },
                    periodSeconds: 10,
                    initialDelaySeconds: 15,
                    timeoutSeconds: 10,
                    failureThreshold: 3,
                },
                volumeMounts: [{
                    name: 'cloudsql',
                    mountPath: '/cloudsql',
                }],
            }],
        },
        traffics: [{ type: 'TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST', percent: 100 }],
    });

    // Open service to public
    const cloudrunAllowAll = new gcp.cloudrunv2.ServiceIamMember(`${ctx.prefix}-cloudrun-allow-all`, {
        name: cloudrun.name,
        location: cloudrun.location,
        role: 'roles/run.invoker',
        member: 'allUsers',
    });

    // Allow GCP Serverless Account to fetch container (don't forget to also do this in the usmedia gcp-project)
    // https://www.pulumi.com/registry/packages/gcp/api-docs/container/registry/
    // https://www.pulumi.com/registry/packages/gcp/api-docs/artifactregistry/repositoryiammember/
    // const iamServerlessArtifacts = new gcp.artifactregistry.RepositoryIamMember(`${ctx.prefix}-artifacts-allow-gcp-account`, {
    //     project: ctx.project,
    //     role: 'roles/artifactregistry.reader',
    //     member: `${accounts.gcpServerless.type}:${accounts.gcpServerless.email}`,
    // });

    // const iamServerlessContainers = new gcp.projects.IAMMember(`${ctx.prefix}-containers-allow-gcp-account`, {
    //     project: ctx.project,
    //     role: 'roles/containerregistry.ServiceAgent',
    //     member: `${accounts.gcpServerless.type}:${accounts.gcpServerless.email}`,
    // });

    return cloudrun;
};
