import { IExecuteFunctions, ILoadOptionsFunctions, IPollFunctions } from 'n8n-workflow';
import { Langfuse as LangfuseSDK } from 'langfuse';

export async function getLangfuse(
  this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions
): Promise<LangfuseSDK> {
  const credentials = await this.getCredentials('langfuseApi', 0);

  return new LangfuseSDK({
    secretKey: credentials.sk as string,
    publicKey: credentials.pk as string,
    baseUrl: credentials.url as string
  });
}