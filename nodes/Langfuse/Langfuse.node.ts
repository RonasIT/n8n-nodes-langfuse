import { IDataObject, IExecuteFunctions, ILoadOptionsFunctions, INodeExecutionData, INodePropertyOptions, INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';
import { ApiPromptMeta, ApiPromptsListParams } from 'langfuse';
import { getLangfuse } from './GenericFunctions';

export class Langfuse implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Langfuse',
    name: 'langfuse',
    icon: 'file:langfuse.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["name"]}}',
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
        displayName: 'Prompt Name or ID', // The value the user sees in the UI
        name: 'name', // The name used to reference the element UI within the code
        type: 'options',
        required: true, // Whether the field is required or not
        default: '',
        description: 'The name of the prompt to be used in the request. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
        typeOptions: {
          loadOptionsMethod: 'getPrompts'
        }
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

  methods = {
    loadOptions: {
      async getPrompts(
        this: ILoadOptionsFunctions,
      ): Promise<INodePropertyOptions[]> {
        const langfuse = await getLangfuse.call(this);

        let allPrompts: ApiPromptMeta[] = [];
        let currentPage = 1;
        let totalPages = 1;

        do {
          const currentApiParams: ApiPromptsListParams = {
            limit: 50,
            page: currentPage,
          };

          const response = await langfuse.api.promptsList(currentApiParams);

          allPrompts = allPrompts.concat(response.data);

          totalPages = response.meta.totalPages;
          currentPage++;
        } while (currentPage <= totalPages);

        return allPrompts.map((item) => ({ name: item.name, value: item.name }));
      },
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: IDataObject[] = [];

    for (let i = 0; i < items.length; i++) {
      const promptName = this.getNodeParameter('name', i) as string;
      const variablesRaw = this.getNodeParameter('variables', i) as Record<string, { name: string, value: string }[]>;

      let variables = {};
      if (variablesRaw?.assignments?.length) {
        variables = variablesRaw?.assignments.reduce((accumulator, item) => {
          accumulator[item.name] = item.value;
          return accumulator;
        }, {} as Record<string, string>);
      }

      const langfuse = await getLangfuse.call(this);

      const prompt = await langfuse.getPrompt(promptName, undefined, { label: 'production' });
      const compiledChatPrompt = prompt.compile(variables);

      const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray([{ json: compiledChatPrompt }] as IDataObject[]),
        { itemData: { item: i } },
      );
      returnData.push(...executionData);
    }

    return [returnData as INodeExecutionData[]];
  };
}
