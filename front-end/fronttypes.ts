export type ClusterElement = {
  name: string,
  created_at: string;
  category: 'pod' | 'service' | 'node',
  data: any
};

export type AvailMem = {
  nodeName: string,
  memNum: number
}
  
export type PodDetails = {
  podName: string,
  podID: number
}

export type NetworkData = {
  nodeName: string,
  bitsPerSecond: number
}
  
export type DiskData = {
  nodeName: string,
  diskNum: number
}
  
export type CpuData = {
  nodeName: string,
  cpuUsage: number
}