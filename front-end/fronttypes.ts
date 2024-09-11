export type ClusterElement = {
    name: string,
    created_at: string;
    category: 'pod' | 'service' | 'node',
    data: any
  };