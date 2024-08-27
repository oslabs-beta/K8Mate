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
    position: { x: 330, y: 5 },
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
    position: { x: 355, y: 125 },
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
    position: { x: 480, y: 125 },
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
    position: { x: 355, y: 50 },
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
    position: { x: 405, y: 210 },
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

const defaultViewport = { x: 0, y: 0, zoom: 1.2 };

function Tree() {
  const [ k8sCluster, setK8sCluster ] = useState([]);
  const [ k8sPodsList, setK8sPods ] = useState([]);
  const [ k8sNodesList, setK8sNodes ] = useState([]);
  const [ nodes, setNodes ] = useState(initialNodes);
  const [ edges, setEdges ] = useState(initialEdges);

  //grab all info regarding the cluster
  useEffect(() => {
    const fetchCluster = async () => {
      try {
        const response = await fetch('http://localhost:8080/cluster/all', {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (response.ok) {
          const cluster = await response.json();
          console.log(cluster);
          setK8sCluster(cluster);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchCluster();
  }, [])

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