import {
  IAuthenticateGeneric,
  ICredentialDataDecryptedObject,
  ICredentialTestRequest,
  ICredentialType,
  IHttpRequestOptions,
  INodeProperties,
} from 'n8n-workflow';

export class LangfuseApi implements ICredentialType {
  name = 'langfuseApi';
  icon = { light: 'file:langfuse.svg', dark: 'file:langfuse.svg' } as const
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

  async authenticate(
    credentials: ICredentialDataDecryptedObject,
    requestOptions: IHttpRequestOptions,
  ): Promise<IHttpRequestOptions> {
    const token = Buffer.from(`${credentials.pk}:${credentials.sk}`).toString('base64');

    requestOptions.headers = {
      ...requestOptions.headers,
      Authorization: `Basic ${token}`,
    };

    return requestOptions;
  }

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.url}}',
      url: '/api/public/v2/prompts'
    }
  }
}