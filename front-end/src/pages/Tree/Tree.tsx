import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "../../components/template/catalyst/button";
import { Heading } from '../../components/template/catalyst/heading';
import { Chrono } from 'react-chrono';
import { 
  ReactFlow, 
  Controls, 
  Background,
  Node,
  Edge,
  applyNodeChanges,
  applyEdgeChanges
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

type ClusterElement = {
  name: string,
  created_at: string;
  category: 'pod' | 'service' | 'node',
  data: any
};

const initialNodes: Node[] = [
  {
    id: 'master-node',
    type: 'input',
    data: { label: 'Master Node' },
    position: { x: 400, y: 5 },
    style: { 
      border: '2px solid #2563eb', 
      padding: 10,
      width: 300,
      height: 300,
      backgroundColor: 'rgba(37, 99, 235, 0.5)',
      color: 'black',
      fontSize: 20,
      fontWeight: 'bold',
      zIndex: -1   
    },
  },
  {
    id: 'etcd',
    data: { label: 'etcd' },
    position: { x: 425, y: 75 },
    style: { 
      border: '1px solid black', 
      padding: 10,
      width: 125,
      height: 58,
    },
  },
  {
    id: 'control-manager',
    data: { label: 'Controller Manager' },
    position: { x: 550, y: 75 },
    style: { 
      border: '1px solid black', 
      padding: 10, 
      width: 125
    },
  },
  {
    id: 'api-server',
    data: { label: 'API Server' },
    position: { x: 425, y: 230},
    style: { 
      border: '1px solid black', 
      padding: 10,
      width: 250 
    },
  },
  {
    id: 'scheduler',
    data: { label: 'Scheduler' },
    position: { x: 475, y: 150 },
    style: { border: '1px solid black', padding: 10 },
  },
]

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'api-server', target: 'etcd' },
  { id: 'e1-3', source: 'api-server', target: 'control-manager' },
  { id: 'e1-4', source: 'api-server', target: 'scheduler' }
]

const defaultViewport = { x: 0, y: 0, zoom: 0.8 };

const Tree = (): JSX.Element => {
  const [ k8sCluster, setK8sCluster ] = useState<ClusterElement[]>([]);
  const [ k8sPodsList, setK8sPods ] = useState<ClusterElement[]>([]);
  const [ k8sNodesList, setK8sNodes ] = useState<ClusterElement[]>([]);
  const [ k8sServicesList, setK8sServices ] = useState<ClusterElement[]>([]);
  const [ k8sClusterHistory, setK8sClusterHistory ] = useState<ClusterElement[]>([]);
  const [ nodes, setNodes ] = useState<Node[]>([]);
  const [ edges, setEdges ] = useState<Edge[]>(initialEdges);
  const [ visibleEdges, setVisibleEdges ] = useState<Set<string>>(new Set()); 
  const [firstLoad, setFirstLoad] = useState<boolean>(true); 

  // Grab the current cluster state when the button is pressed
  const loadCluster = async () => {
    try {
      const response = await fetch('http://localhost:8080/cluster/all', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const cluster: ClusterElement[] = await response.json();
        console.log('CLUSTER INFO', cluster);
        setNodes(initialNodes);
        setK8sCluster(cluster);
        setFirstLoad(false); 
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Grab the cluster history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:8080/cluster/history', {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const clusterHistory: ClusterElement[] = await response.json();
          setK8sClusterHistory(clusterHistory);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchHistory();
  }, [k8sCluster]);

  // Set nodes based on the loaded cluster (only triggered if cluster is loaded)
  useEffect(() => {
    if (!firstLoad) {  
      const podsNodes: ClusterElement[] = k8sCluster.filter((ele) => ele.category === 'pod');
      const servicesNodes: ClusterElement[] = k8sCluster.filter((ele) => ele.category === 'service');
      const nodeNodes: ClusterElement[] = k8sCluster.filter((ele) => ele.category === 'node');
  
      setK8sPods(podsNodes);
      setK8sServices(servicesNodes);
      setK8sNodes(nodeNodes);
  
      const xCoordinatesCalc = (num: number): number => {
        return (num * 350) + 50;
      }
  
      const nodesForFlow: Node[] = k8sNodesList.map((node, index) => ({
        id: node.name,
        data: { label: `Worker Node: ${node.name}` },
        position: { x: xCoordinatesCalc(index), y: 400},
        style: { 
          border: '2px solid #2563eb', 
          padding: 10,
          width: 300,
          height: 100,
          backgroundColor: 'rgba(200, 162, 255, 0.5)',
          color: 'black',
          fontSize: 15,
          fontWeight: 'bold',
          zIndex: -1   
        },
      }));

      const groupedPodsCache: Record<string, ClusterElement[]> = {};

      k8sNodesList.forEach((workerNode) => {
        const workerNodeName = workerNode.name;
        if (!groupedPodsCache[workerNodeName]) {
          groupedPodsCache[workerNodeName] = [];
        } 
        groupedPodsCache[workerNodeName] = k8sPodsList.filter((pod) => pod.data.nodeName === workerNodeName)
      })
  
      const podsForFlow: Node[] = [];
    
      Object.keys(groupedPodsCache).forEach((nodeName, nodeIndex) => {
        groupedPodsCache[nodeName].forEach((pod, podIndex) => {
          const xPosition = nodeIndex * 400 + 70;  
          const yPosition = 650 + podIndex * 75;
    
          podsForFlow.push({
            id: pod.name,
            data: { label: `Pod: ${pod.name}`},
            position: { x: xPosition, y: yPosition },
            style: { 
              border: '1px solid black', 
              padding: 10, 
              fontSize: 7,
              backgroundColor: 'green'
             },
          });
        });
      });
  
      setNodes(prev => [...prev, ...nodesForFlow, ...podsForFlow]);
    }
  }, [k8sCluster, firstLoad]); 

  // Set edges logic remains the same
  useEffect(() => {
    if (!firstLoad) { 
      const masterNodeToWorkerNodes: Edge[] = k8sNodesList.map((node, index) => ({
        id: `el2-${index}`,
        source: 'api-server',
        target: node.name,
      }));

      const workerNodeToPods: Edge[] = k8sPodsList.map((pod, index) => ({
        id: `el3-${index}`,
        source: pod.data.nodeName,
        target: pod.name,
      }));

      const connectedServices = new Set<string>();

      const serviceToPods: Edge[] = k8sServicesList.flatMap((service, serviceIndex) => {
        if (!service.data.selector) return [];
        const matchingPods = k8sPodsList.filter((pod) => {
          if (!pod.data.labels) return;
          return Object.entries(service.data.selector).every(([key, value]) => 
            pod.data.labels[key] === value
          )
        });
        if (matchingPods.length > 0) {
          connectedServices.add(service.name);
        }

        return matchingPods.map((pod, podIndex) => ({
          id: `s-p-${serviceIndex}-${podIndex}`,
          source: service.name,
          target: pod.name,
        }));
      });

      const serviceNodes: Node[] = k8sServicesList
        .filter((service) => connectedServices.has(service.name))
        .map((service, index) => ({
          id: service.name,
          data: { label: `Service: ${service.name}` },
          position: { x: 1200, y: 400 + index * 75 },
          style: { 
            border: '1px solid black', 
            padding: 10, 
            fontSize: 7,
            backgroundColor: 'orange',
           },
        }))

      const containerEdges: Edge[] = [];
      const containerNodes: Node[] = k8sPodsList.flatMap((pod, podIndex) => {
        return pod.data.containers.map((container, containerIndex) => {
          const edgeId = `p-c-${pod.name}-${container.name}`;
          containerEdges.push({
            id: edgeId,
            source: pod.name,
            target: container.name,
          });
          return {
            id: container.name,
            data: { label: `Container: ${container.name}` },
            position: { x: -200, y: 400 + (podIndex * 75) + (containerIndex * 75) },
            style: {
              border: '1px solid black', 
              padding: 10, 
              fontSize: 7,
              backgroundColor: 'white',
            },
          };
        });
      });

      setEdges(prev => {
        const newWorkerEdges: Edge[] = masterNodeToWorkerNodes.filter(
          (newEdge) => !prev.some((edge) => edge.id === newEdge.id)
        );
        const newPodEdges: Edge[] = workerNodeToPods.filter(
          (newEdge) => !prev.some((edge) => edge.id === newEdge.id)
        )
        const newServiceEdges: Edge[] = serviceToPods.filter(
          (newEdge) => !prev.some((edge) => edge.id === newEdge.id)
        )
        // return [...prev, ...newWorkerEdges, ...newPodEdges, ...newServiceEdges, ...containerEdges]
        return [...newWorkerEdges, ...newPodEdges, ...newServiceEdges, ...containerEdges]
      })

      setNodes(prev => [ ...prev, ...serviceNodes, ...containerNodes ])
     
    }
  }, [k8sCluster, firstLoad, k8sClusterHistory]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onNodeClick = useCallback((event, node) => {
    setVisibleEdges((prevVisibleEdges) => {
      const newVisibleEdges = new Set(prevVisibleEdges);
      edges.forEach((edge) => {
        if (edge.source === node.id || edge.target === node.id) {
          if (newVisibleEdges.has(edge.id)) {
            newVisibleEdges.delete(edge.id);
          } else {
            newVisibleEdges.add(edge.id);
          }
        }
      });
      return newVisibleEdges;
    });
  }, [edges]);

  const updatedEdges: Edge[] = edges.map((edge) => ({
    ...edge,
    style: {
      ...edge.style,
      stroke: 
        edge.id.startsWith('s-p') || edge.id.startsWith('p-c')
        ? (visibleEdges.has(edge.id) ? 'grey' : 'none') 
        : 'grey', 
        
    },
  }));

  const handleSetClusterFromHistory = (pods: ClusterElement[], nodes: ClusterElement[], services: ClusterElement[]) => {
  
    const newNodes: Node[] = nodes.map((node, index) => ({
      id: node.name,
      data: { label: `Worker Node: ${node.name}` },
      position: { x: index * 350 + 50, y: 400},
      style: { 
        border: '2px solid #2563eb', 
        padding: 10,
        width: 300,
        height: 100,
        backgroundColor: 'rgba(200, 162, 255, 0.5)',
        color: 'black',
        fontSize: 15,
        fontWeight: 'bold',
        zIndex: -1   
      },
    }));

    const groupedPodsCache: Record<string, ClusterElement[]> = {};

    nodes.forEach((workerNode) => {
      const workerNodeName = workerNode.name;
      if (!groupedPodsCache[workerNodeName]) {
        groupedPodsCache[workerNodeName] = [];
      } 
      groupedPodsCache[workerNodeName] = pods.filter((pod) => pod.data.nodeName === workerNodeName)
    })

    const newPods: Node[] = [];
  
    //positioning calculator based on indexes and grouped pods
    Object.keys(groupedPodsCache).forEach((nodeName, nodeIndex) => {
      groupedPodsCache[nodeName].forEach((pod, podIndex) => {
        const xPosition = nodeIndex * 400 + 70;  
        const yPosition = 650 + podIndex * 75;
  
        newPods.push({
          id: pod.name,
          data: { label: `Pod: ${pod.name}`},
          position: { x: xPosition, y: yPosition },
          style: { 
            border: '1px solid black', 
            padding: 10, 
            fontSize: 7,
            backgroundColor: 'green'
           },
        });
      });
    });

    const newServices: Node[] = services.map((service, index) => ({
      id: service.name,
      data: { label: `Service: ${service.name}` },
      position: { x: 1200, y: 400 + index * 75 },
      style: { 
        border: '1px solid black', 
        padding: 10, 
        fontSize: 7,
        backgroundColor: 'orange',
        },
    }));

    const newNodeEdges: Edge[] = k8sNodesList.map((node, index) => ({
      id: `el2-${index}`,
      source: 'api-server',
      target: node.name,
    }));

    const newContainerEdges: Edge[] = [];
    const newContainerNodes: Node[] = pods.flatMap((pod, podIndex) => {
      return pod.data.containers.map((container, containerIndex) => {
        const edgeId = `p-c-${pod.name}-${container.name}`
        newContainerEdges.push({
          id: edgeId,
          source: pod.name,
          target: container.name,
        });
        return {
          id: container.name,
          data: { label: `Container: ${container.name}` },
          position: { x: -200, y: 400 + (podIndex * 75) + (containerIndex * 75) },
          style: {
            border: '1px solid black', 
            padding: 10, 
            fontSize: 7,
            backgroundColor: 'white',
          },
        };
      });
    });

    const newPodEdges: Edge[] = pods.map((pod, index) => ({
      id: `el3-${index}`,
      source: pod.data.nodeName,
      target: pod.name,
    }))

    const connectedServices = new Set<string>();
    const newServiceEdges: Edge[] = services.flatMap((service, serviceIndex) => {
      if (!service.data.selector) return [];
      const matchingPods = pods.filter((pod) => {
        if (!pod.data.labels) return;
        return Object.entries(service.data.selector).every(([key, value]) => 
          pod.data.labels[key] === value
        )
      });
      if (matchingPods.length > 0) {
        connectedServices.add(service.name);
      }

      return matchingPods.map((pod, podIndex) => ({
        id: `s-p-${serviceIndex}-${podIndex}`,
        source: service.name,
        target: pod.name,
      }));
    });

    setNodes([...initialNodes, ...newNodes, ...newPods, ...newServices, ...newContainerNodes]);
    setEdges([...newNodeEdges, ...newPodEdges, ...newContainerEdges, ...newServiceEdges])
  }

  const handleRefresh = async () => {
    try {
      const response = await fetch('http://localhost:8080/cluster/refresh', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const refreshedCluster: ClusterElement[] = await response.json();
        setK8sCluster(refreshedCluster);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleSnapshot = async () => {
    const pods: ClusterElement[] = k8sCluster.filter((ele) => ele.category === 'pod');
    const services: ClusterElement[] = k8sCluster.filter((ele) => ele.category === 'service');
    const nodes: ClusterElement[] = k8sCluster.filter((ele) => ele.category === 'node');
    try {
      const response = await fetch('http://localhost:8080/cluster/postAll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pods: pods,
          nodes: nodes,
          services: services,
        })
      });
      if (response.ok) {
        console.log('Snapshot taken');
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Heading>K8s Structure</Heading>
      <div style={{ height: '750px' }}>
        <Button onClick={loadCluster}>Load Recent Cluster</Button> 
        <Button onClick={handleRefresh}>Update Cluster</Button>
        <Button onClick={handleSnapshot}>Take Snapshot</Button>
        {!firstLoad ? (  
          <ReactFlow
            nodes={nodes}
            edges={updatedEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            defaultViewport={defaultViewport}
            minZoom={0.2}
            maxZoom={4}
            onNodeClick={onNodeClick}
          >
            <Background />
            <Controls />
          </ReactFlow>
        ) : (
          <span></span>
        )}
        {k8sClusterHistory.length > 0 ? (
          <div style={{ height: '250px', width: '100%', position: 'relative', marginTop: '20px' }}>
            <Chrono
              items={k8sClusterHistory.map((cluster, index) => ({
                title: new Date(cluster.created_at).toLocaleString(),
                key: index,
              }))}
              mode="HORIZONTAL"
              allowDynamicUpdate={true}
              enableDarkToggle={true}
              activeItemIndex={null}
              cardLess={true}
              toolbarPosition='BOTTOM'
              onItemSelected={(item) => {
                const selectedCluster = k8sClusterHistory.find((cluster) => new Date(cluster.created_at).toLocaleString() === item.title);
                if (selectedCluster) {
                  handleSetClusterFromHistory(selectedCluster.data.pods, selectedCluster.data.nodes, selectedCluster.data.services);
                }
              }}
            />
          </div>
        ) : (
          <p>Grabbing history...</p> 
        )}
      </div>
    </>
  )
}

export default Tree;