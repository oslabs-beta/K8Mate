import React, { useState, useEffect, useCallback } from 'react'
import { 
  ReactFlow, 
  Controls, 
  Background,
  applyNodeChanges,
  applyEdgeChanges
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

function Tree() {
  const [ k8sPodsList, setK8sPods ] = useState([]);
  const [ k8sNodesList, setK8sNodes ] = useState([]);
  const [ nodes, setNodes ] = useState(initialNodes);
  const [ edges, setEdges ] = useState(initialEdges);

  const initialNodes = [

  ]

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
  // useEffect(() => {
  //   const fetchPods = async () => {
  //     try {
  //       const response = await fetch('http://localhost:8080/pods', {
  //         headers: {
  //           'Content-Type': 'application/json'
  //         }
  //       })
  //       if (response.ok) {
  //         const pods = await response.json();
  //         console.log(pods);
  //         setPods(pods);
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  //   fetchPods();
  // }, [])

  return (
    <>
    <div>Tree</div>
    <div style={{ height: '800px' }}>
    <ReactFlow
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      fitView
    >
      <Background />
      <Controls />
    </ReactFlow>
  </div>
  </>
  )
}


export default Tree