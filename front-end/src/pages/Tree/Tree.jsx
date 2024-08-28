import React, { useState, useEffect, useCallback } from 'react'
import { 
  ReactFlow, 
  Controls, 
  Background,
  applyNodeChanges,
  applyEdgeChanges
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
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
      backgroundColor: 'rgba(37, 99, 235, 0.2)',
      color: 'white',
      fontSize: 15,
      zIndex: -1   
    },
  },
  {
    id: 'etcd',
    data: { label: 'etcd' },
    position: { x: 425, y: 125 },
    parentNode: 'master-node',
    extent: 'parent',
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
    position: { x: 550, y: 125 },
    parentNode: 'master-node',
    extent: 'parent',
    style: { 
      border: '1px solid black', 
      padding: 10, 
      width: 125
    },
  },
  {
    id: 'api-server',
    data: { label: 'API Server' },
    position: { x: 425, y: 50 },
    parentNode: 'master-node',
    extent: 'parent',
    style: { 
      border: '1px solid black', 
      padding: 10,
      width: 250 
    },
  },
  {
    id: 'scheduler',
    data: { label: 'Scheduler' },
    position: { x: 475, y: 210 },
    parentNode: 'master-node',
    extent: 'parent',
    style: { border: '1px solid black', padding: 10 },
  },
]

const initialEdges = [
  { id: 'e1-2', source: 'api-server', target: 'etcd' },
  { id: 'e1-3', source: 'api-server', target: 'control-manager' },
  { id: 'e1-4', source: 'api-server', target: 'scheduler' }
]

const defaultViewport = { x: 0, y: 0, zoom: 0.8 };

function Tree() {
  const [ k8sCluster, setK8sCluster ] = useState([]);
  const [ k8sPodsList, setK8sPods ] = useState([]);
  const [ k8sNodesList, setK8sNodes ] = useState([]);
  const [ k8sServicesList, setK8sServices ] = useState([]);
  const [ nodes, setNodes ] = useState(initialNodes);
  const [ edges, setEdges ] = useState(initialEdges);

  //grab all info regarding the cluster
  useEffect(() => {
    const fetchCluster = async () => {
      try {
        const response = await fetch('http://localhost:8080/cluster/refresh', {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (response.ok) {
          const cluster = await response.json();
          console.log('CLUSTER INFO', cluster);
          setK8sCluster(cluster);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchCluster();
  }, [])
  
  //setting NODES
  useEffect(() => {
    const podsNodes = k8sCluster.filter((ele) => ele.category === 'pod');
    console.log('POD NODES', podsNodes)
    const servicesNodes = k8sCluster.filter((ele) => ele.category === 'service')
    console.log('SERVICE NODES', servicesNodes)
    const nodeNodes = k8sCluster.filter((ele) => ele.category === 'node');
    console.log('NODE NODES', nodeNodes)

    setK8sPods(podsNodes);
    setK8sServices(servicesNodes);
    setK8sNodes(nodeNodes);

    const xCoordinatesCalc = (num) => {
      return (num * 350) + 50;
    }

    const yCoordinatesCalc = (num) => {
      return (num * 50)
    }

    const nodesForFlow = k8sNodesList.map((node, index) => ({
      // id: `worker-node-${index}`,
      id: node.name,
      data: { label: `Worker Node: ${node.name}` },
      position: { x: xCoordinatesCalc(index), y: 400},
      style: { 
        border: '2px solid #2563eb', 
        padding: 10,
        width: 300,
        height: 600,
        backgroundColor: 'rgba(255, 165, 0, 0.2)',
        color: 'white',
        fontSize: 15,
        zIndex: -1   
      },
    }));

    const podsForFlow = k8sPodsList.map((pod, index) => ({
      id: pod.name,
      data: { label: `Pod: ${pod.name}`},
      position: { x: -300, y: yCoordinatesCalc(index)},
      // extent: 'parent',
      style: { border: '1px solid black', padding: 10, fontSize: 7 },
    }));

    const servicesForFlow = k8sServicesList.map((service, index) => ({
      id: `service-${index}`,
      data: { label: `Service: ${service.name}` },
      position: { x: -100, y: yCoordinatesCalc(index)},
      // extent: 'parent',
      style: { border: '1px solid black', padding: 10, fontSize: 7 },
    }))

    setNodes(prev => [...prev, ...nodesForFlow, ...podsForFlow, ...servicesForFlow]);

  }, [k8sCluster])

  //setting EDGES
  useEffect(() => {
    const masterNodeToWorkerNodes = k8sNodesList.map((node, index) => ({
      id: `el2-${index}`,
      source: 'master-node',
      // target: `worker-node-${index}`
      target: node.name,
    }))

    const workerNodeToPods = k8sPodsList.map((pod, index) => ({
      id: `el3-${index}`,
      source: pod.data.nodeName,
      target: pod.name,
    }))

    // setEdges(prev => [...prev, ...masterNodeToWorkerNodes])
    setEdges(prev => {
      const newWorkerEdges = masterNodeToWorkerNodes.filter(
        (newEdge) => !prev.some((edge) => edge.id === newEdge.id)
      );
      const newPodEdges = workerNodeToPods.filter(
        (newEdge) => !prev.some((edge) => edge.id === newEdge.id)
      )
      return [...prev, ...newWorkerEdges, ...newPodEdges]
    })
    console.log(edges)
  }, [k8sCluster])

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  return (
    <>
    <div>Tree</div>
    <div style={{ height: '1000px' }}>
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      defaultViewport={defaultViewport}
      minZoom={0.2}
      maxZoom={4}
    >
      <Background />
      <Controls />
    </ReactFlow>
  </div>
  </>
  )
}


export default Tree