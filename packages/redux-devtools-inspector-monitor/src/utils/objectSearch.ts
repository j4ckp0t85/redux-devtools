import { SearchQuery } from '../searchPanel/SearchPanel';
import workerScript from './searchWorker';

type PrimitiveValue = string | number | boolean | undefined | null;
export type Value =
  | PrimitiveValue
  | Value[]
  | { [key: string | number]: Value };

export function searchInObject(
  objectToSearch: Value,
  query: SearchQuery
): Promise<string[]> {
  return new Promise((resolve) => {
    const worker = new Worker(workerScript);

    worker.onmessage = (event: MessageEvent<string[]>) => {
      resolve(event.data);
      worker.terminate();
    };

    worker.postMessage({ objectToSearch, query });
  });
}