import { Input } from '@pulumi/pulumi';

export type StackName = 'production' | 'staging';

export interface Context {
    organization: string;
    project: string;
    number: string;
    stack: string;
    prefix: string;
    region: string;
}

export interface IAMMembers {
    cloudrun: IAMServiceAccount;
    usAdmin: IAMGroup;
    usDevelopers: IAMGroup;
    usDevops: IAMGroup;
    usMonitoring: IAMGroup;
    usSecurity: IAMGroup;
}

interface IAMUser {
    type: 'user';
    email: Input<string>;
}

interface IAMServiceAccount {
    type: 'serviceAccount';
    email: Input<string>;
}

interface IAMGroup {
    type: 'group';
    email: Input<string>;
}

interface IAMDomain {
    type: 'domain';
    domain: Input<string>;
}
