import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';


export class LangfuseApi implements ICredentialType {
  name = 'langfuseApi';
  displayName = 'Langfuse API';
  documentationUrl = 'https://docs.n8n.io/integrations/creating-nodes/build/declarative-style-node/';
  properties: INodeProperties[] = [
    {
      displayName: 'URL',
      name: 'url',
      type: 'string',
      typeOptions: { password: false },
      default: 'https://cloud.langfuse.com',
    }, {
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