import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import { Context } from '../interfaces';


// https://medium.com/develop-everything/create-a-cloud-run-service-and-https-load-balancer-with-pulumi-3ba542e60367

export const getIPs = (
    ctx: Context,
    stack: pulumi.StackReference,
) => {
    return {
        ipv4: stack.getOutput('ipv4'),
        ipv6: stack.getOutput('ipv6'),
    };
};

export const setupLoadBalancer = (
    ctx: Context,
    apiProdServiceId: pulumi.Input<string>,
) => {
    const hostsApiProduction = [ 'api.costing-tool.nachhaltige-agrarlieferketten.org' ];

    //
    // Certificates
    //
    const productionCertificate = new gcp.compute.ManagedSslCertificate(`${ctx.prefix}-api-certificate-prod`, {
        managed: { domains: hostsApiProduction },
    });

    //
    // HTTPS
    //
    const httpsMap = new gcp.compute.URLMap(`${ctx.prefix}-https`, {
        name: `${ctx.prefix}-api-https`,
        defaultService: apiProdServiceId,
        hostRules: [{
            pathMatcher: 'production',
            hosts: hostsApiProduction,
        }],
        pathMatchers: [{
            name: 'production',
            defaultService: apiProdServiceId,
        }],
    });

    const httpsProxy = new gcp.compute.TargetHttpsProxy(`${ctx.prefix}-https-proxy`, {
        name: `${ctx.prefix}-https-proxy`,
        urlMap: httpsMap.selfLink,
        sslCertificates: [ productionCertificate.id ],
        quicOverride: 'NONE',
    });

    //
    // HTTP
    //
    const httpMap = new gcp.compute.URLMap(`${ctx.prefix}-http`, {
        name: `${ctx.prefix}-http`,
        hostRules: [{
            hosts: hostsApiProduction,
            pathMatcher: 'all',
        }],
        defaultUrlRedirect: { httpsRedirect: true, stripQuery: false },
        pathMatchers: [{
            name: 'all',
            defaultUrlRedirect: { httpsRedirect: true, stripQuery: false },
        }],
    });

    const httpProxy = new gcp.compute.TargetHttpProxy(`${ctx.prefix}-http-proxy`, {
        urlMap: httpMap.selfLink,
    });

    //
    // Global rules
    //
    const ipv4 = new gcp.compute.GlobalAddress(`${ctx.prefix}-ipv4`, {
        addressType: 'EXTERNAL',
        ipVersion: 'IPV4',
    });

    const ipv6 = new gcp.compute.GlobalAddress(`${ctx.prefix}-ipv6`, {
        addressType: 'EXTERNAL',
        ipVersion: 'IPV6',
    });

    const globalHttpsV4Rule = new gcp.compute.GlobalForwardingRule(`${ctx.prefix}-global-https-v4-rule`, {
        ipAddress: ipv4.address,
        ipProtocol: 'TCP',
        portRange: '443',
        target: httpsProxy.selfLink,
        loadBalancingScheme: 'EXTERNAL',
    });

    const globalHttpV4Rule = new gcp.compute.GlobalForwardingRule(`${ctx.prefix}-global-http-v4-rule`, {
        ipAddress: ipv4.address,
        ipProtocol: 'TCP',
        portRange: '80',
        target: httpProxy.selfLink,
        loadBalancingScheme: 'EXTERNAL',
    });

    const globalHttpsV6Rule = new gcp.compute.GlobalForwardingRule(`${ctx.prefix}-global-https-v6-rule`, {
        ipAddress: ipv6.address,
        ipProtocol: 'TCP',
        portRange: '443',
        target: httpsProxy.selfLink,
        loadBalancingScheme: 'EXTERNAL',
    });

    const globalHttpV6Rule = new gcp.compute.GlobalForwardingRule(`${ctx.prefix}-global-http-v6-rule`, {
        ipAddress: ipv6.address,
        ipProtocol: 'TCP',
        portRange: '80',
        target: httpProxy.selfLink,
        loadBalancingScheme: 'EXTERNAL',
    });

    return {
        ipv4: ipv4.address,
        ipv6: ipv6.address,
    };
};
