import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class LangfuseApi implements ICredentialType {
  name = 'langfuseApi';
  displayName = 'Langfuse API';
  // Uses the link to this tutorial as an example
  // Replace with your own docs links when building your own nodes
  documentationUrl = 'https://docs.n8n.io/integrations/creating-nodes/build/declarative-style-node/';
  properties: INodeProperties[] = [
    {
      displayName: 'Public Key',
      name: 'pk',
      type: 'string',
      typeOptions: { password: false },
      default: '',
    },
    {
      displayName: 'Secret Key',
      name: 'sk',
      type: 'string',
      typeOptions: { password: true },
      default: '',
    },
  ];
}