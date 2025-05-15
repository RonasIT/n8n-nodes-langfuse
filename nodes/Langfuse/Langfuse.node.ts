import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

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
        displayName: 'Name', // The value the user sees in the UI
        name: 'name', // The name used to reference the element UI within the code
        type: 'string',
        required: true, // Whether the field is required or not
        default: '',
        description: 'The name of the prompt'
      }
      // Optional/additional fields will go here
    ],
  };
}
