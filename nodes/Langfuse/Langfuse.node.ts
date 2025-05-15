import { IDataObject, IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';
import { Langfuse as LangfuseSDK } from 'langfuse';

export class Langfuse implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Langfuse',
    name: 'langfuse',
    icon: 'file:langfuse.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Langfuse',
    defaults: {
      name: 'Langfuse',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'langfuseApi',
        required: true,
      },
    ],
    /**
     * In the properties array we have two mandatory options objects required
     *
     * [Resource & Operation]
     *
     * https://docs.n8n.io/integrations/creating-nodes/code/create-first-node/#resources-and-operations
     *
     * In our example, the operations are separated into their own file (HTTPVerbDescription.ts)
     * to keep this class easy to read.
     *
     */
    properties: [
      {
        displayName: 'Prompt Name', // The value the user sees in the UI
        name: 'name', // The name used to reference the element UI within the code
        type: 'string',
        required: true, // Whether the field is required or not
        default: '',
        description: 'The name of the prompt to be used in the request',
      },
      {
        displayName: 'Variables',
        name: 'variables',
        type: 'assignmentCollection',
        default: {},
        description: 'The variables to be used in the prompt',
      },
    ],

  };
  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const promptName = this.getNodeParameter('name', 0) as string;
    const variablesRaw = this.getNodeParameter('variables', 0) as Record<string, { name: string, value: string }[]>;

    let variables = {};
    if (variablesRaw?.assignments?.length) {
      variables = variablesRaw?.assignments.reduce((accumulator, item) => {
        accumulator[item.name] = item.value;
        return accumulator;
      }, {} as Record<string, string>);
    }
    const credentials = await this.getCredentials('langfuseApi', 0);
    const returnData: IDataObject[] = [];


    const langfuse = new LangfuseSDK({
      secretKey: credentials.sk as string,
      publicKey: credentials.pk as string,
      baseUrl: 'https://cloud.langfuse.com'
    });

    const prompt = await langfuse.getPrompt(promptName, undefined, { label: 'production' });
    const compiledChatPrompt = prompt.compile(variables);

    returnData.push({ json: { compiledChatPrompt } });

    return [returnData as INodeExecutionData[]];
  };
}
