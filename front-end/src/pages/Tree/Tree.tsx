import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "../../components/template/catalyst/button.tsx";
import { Heading } from '../../components/template/catalyst/heading.tsx';
import { Dialog, DialogTitle, DialogDescription, DialogActions } from '../../components/template/catalyst/dialog';
import { Chrono } from 'react-chrono';

import { getSingleCluster, refreshSingleCluster, postSnapshot, getHistory } from '../../services/treeService.js'
import { ClusterElement } from '../../../fronttypes.ts';
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

import { 
  PlusIcon, 
  ArrowDownTrayIcon,
  ArrowPathIcon,
} from '@heroicons/react/16/solid'



/* ------------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------- CREATING INITIAL ELEMENTS  --------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------- */

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

/* ------------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------- CREATING THE TREE STRUCTURE  --------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------- */

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
  const [selectedNodeId, setSelectedNodeId] = useState<string[]>([]);
  const [showAlert, setShowAlert] = useState<(boolean | React.JSX.Element[])[]>([false])

  /*--------------------------------------------- FETCH REQUESTS ---------------------------------------------- */

  const loadCluster = async () => {
    try {
      const response = await getSingleCluster();

      const cluster: ClusterElement[] = response;
      setNodes(initialNodes);
      setK8sCluster(cluster);
      setFirstLoad(false);
    } catch (err) { console.log(err); }
  };

  const handleRefresh = async () => {
    try {
      const response = await refreshSingleCluster();
      
      const refreshedCluster: ClusterElement[] = response;
      setK8sCluster(refreshedCluster);
    } catch (err) { console.log(err); }
  }

  const handleSnapshot = async () => {
    try { 
      await postSnapshot(); 
      await fetchHistory();
    } 
    catch (err) { console.log(err); }
  }

  const fetchHistory = async () => {
    try {
      const response = await getHistory();
      
      const clusterHistory: ClusterElement[] = response;
      console.log(response);
      setK8sClusterHistory(clusterHistory);
    } catch (err) { console.log(err); }
  }

  /* ------------------------------------------------------------------------------------------------------------- */
  /* ----------------------------------------- CREATING THE NODE OBJECTS ----------------------------------------- */
  /* ------------------------------------------------------------------------------------------------------------- */

  // Set nodes based on the loaded cluster (only triggered if cluster is loaded and 'load recent cluster' has been pressed)
  useEffect(() => {
    if (!firstLoad) {  
      //populate arrays with corresponding information
      const podsNodes: ClusterElement[] = k8sCluster.filter((ele) => ele.category === 'pod');
      const servicesNodes: ClusterElement[] = k8sCluster.filter((ele) => ele.category === 'service');
      const nodeNodes: ClusterElement[] = k8sCluster.filter((ele) => ele.category === 'node');
  
      //populate the k8s states with their corresponding array of data
      setK8sPods(podsNodes);
      setK8sServices(servicesNodes);
      setK8sNodes(nodeNodes);
  
      //create node array of WORKER NODES
      const nodesForFlow: Node[] = nodeNodes.map((node, index) => ({
        id: node.name,
        data: { label: `Worker Node: ${node.name}`, data: node },
        position: { x: (index * 350) + 50, y: 400},
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

      //connect the PODS to their correct WORKER NODE
      nodeNodes.forEach((workerNode) => {
        const workerNodeName = workerNode.name;
        if (!groupedPodsCache[workerNodeName]) {
          groupedPodsCache[workerNodeName] = [];
        }
        groupedPodsCache[workerNodeName] = podsNodes.filter((pod) => pod.data.nodeName === workerNodeName)
      })
  
      //create node array of PODS
      const podsForFlow: Node[] = [];
      Object.keys(groupedPodsCache).forEach((nodeName, nodeIndex) => {
        groupedPodsCache[nodeName].forEach((pod, podIndex) => {
          const xPosition = nodeIndex * 400 + 70;  
          const yPosition = 650 + podIndex * 75;
    
          podsForFlow.push({
            id: pod.name,
            data: { label: `Pod: ${pod.name}`, data: pod },
            position: { x: xPosition, y: yPosition },
            style: { 
              border: '1px solid black', 
              padding: 10, 
              fontSize: 7,
              backgroundColor: 'green',
              boxShadow: '0px 0px',
             },
          });
        });
      });

      setNodes(prev => [...prev, ...nodesForFlow, ...podsForFlow]);
    }
  }, [k8sCluster, firstLoad]); 

  /* ------------------------------------------------------------------------------------------------------------- */
  /* ----------------------------- CREATING THE EDGES, SERVICES, AND CONTAINER NODES ----------------------------- */
  /* ------------------------------------------------------------------------------------------------------------- */

  // set and connect the edges upon first load, current cluster, or a new cluster history change
  useEffect(() => {
    if (!firstLoad) { 
      //creating edges array connecting MASTER NODE to WORKER NODES
      const masterNodeToWorkerNodes: Edge[] = k8sNodesList.map((node, index) => ({
        id: `el2-${index}`,
        source: 'api-server',
        target: node.name,
      }));

      //creating edges array connecting WORKER NODES to PODS
      const workerNodeToPods: Edge[] = k8sPodsList.map((pod, index) => ({
        id: `el3-${index}`,
        source: pod.data.nodeName,
        target: pod.name,
      }));

      const connectedServices = new Set<string>();

      //creating edges array connecting SERVICES to PODS
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
        
        //return array containing service-pod paris
        return matchingPods.map((pod, podIndex) => ({
          id: `s-p-${serviceIndex}-${podIndex}`,
          source: service.name,
          target: pod.name,
        }));
      });

      //create node array of SERVICES
      const serviceNodes: Node[] = k8sServicesList
        .filter((service) => connectedServices.has(service.name))
        .map((service, index) => ({
          id: service.name,
          data: { label: `Service: ${service.name}`, data: service },
          position: { x: 1200, y: 400 + index * 75 },
          style: { 
            border: '1px solid black', 
            padding: 10, 
            fontSize: 7,
            backgroundColor: 'orange',
          },
        }
      ));

      //create node array of CONTAINERS and corresponding edges
      const containerEdges: Edge[] = [];
      const containerNodes: Node[] = k8sPodsList.flatMap((pod, podIndex) => {
        return pod.data.containers.map((container, containerIndex) => {
          const edgeId = `p-c-${pod.name}-${container}`;
          //populate container edges array
          containerEdges.push({
            id: edgeId,
            source: pod.name,
            target: container,
          });
          
          //creating the container node
          return {
            id: container,
            data: { label: `Container: ${container}` },
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

      //updating edges state with the created node-to-node pairs
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

        return [...newWorkerEdges, ...newPodEdges, ...newServiceEdges, ...containerEdges]
      })

      //updating nodes state with the created nodes
      setNodes(prev => [ ...prev, ...serviceNodes, ...containerNodes ])
     
    }
  }, [k8sCluster, firstLoad, k8sClusterHistory]);

  /* ------------------------------------------------------------------------------------------------------------- */
  /* ----------------------------------------- ON EVENT TRIGGER FUNCTIONS ---------------------------------------- */
  /* ------------------------------------------------------------------------------------------------------------- */

  //update nodes array state upon changes
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  //update edges array state upon changes
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  //CURSOR HOVERS OVER NODE: make corresponding edges visible and node glow
  const onNodeEnter = useCallback((event, node) => {
    setVisibleEdges((prevVisibleEdges) => {
      const newVisibleEdges = new Set(prevVisibleEdges);
      setSelectedNodeId([node.id, 'glow']);
      edges.forEach((edge) => {
        if (edge.source === node.id || edge.target === node.id) {
          newVisibleEdges.add(edge.id);
        }
      });
      return newVisibleEdges;
    });
  }, [edges]);

  //CURSOR STOPS HOVERING OVER NODE: make corresponding edges invisible and undo glow
  const onNodeLeave = useCallback((event, node) => {
    setVisibleEdges((prevVisibleEdges) => {
      const newVisibleEdges = new Set(prevVisibleEdges);
      setSelectedNodeId([node.id, 'unglow']);
      edges.forEach((edge) => {
        if (edge.source === node.id || edge.target === node.id) {
          newVisibleEdges.delete(edge.id);
        }
      });
      return newVisibleEdges;
    });
  }, [edges]);

  //helper function for information array
  const populateInformation = (type: string, information: string[], node): void => {
    information.push(`${type} name: ${node.data.data.name}`);        
    information.push(`Time created: ${new Date(node.data.data.created_at).toLocaleString()}`);
    information.push(`UID: ${node.data.data.uid}`);
  }

  //create dialog description elements using information array
  const dialogDescriptor = (information: string[]): React.JSX.Element[] => {
    const dialogs: React.JSX.Element[] = [];
    information.forEach(ele => { dialogs.push(<DialogDescription>{ele}</DialogDescription>); })
    return dialogs;
  }

  //MOUSE CLICKS ON NODE: send over array of populated dialog descriptions based on the node clicked
  const onNodeClick = (event, node) => {
    const category = node.data.label.split(':')[0];
    const information: string[] = [];
    
    //get information depending on node category
    switch (category) {
      case 'Pod':
        let str: string = 'Containers:';
        node.data.data.data.containers.forEach(ele => {str+= ` ${ele},`});

        populateInformation('Pod', information, node);
        information.push(str.slice(0, -1));
        break;

      case 'Worker Node':      
        populateInformation('Worker node', information, node);
        information.push(`Cluster name: ${node.data.data.data.clusterName}`);
        information.push(`Instance type: ${node.data.data.data.instanceType}`);
        information.push(`Nodegroup name: ${node.data.data.data.nodegroupName}`);
        information.push(`Region: ${node.data.data.data.region}`);
        break;

      case 'Service':
        populateInformation('Service', information, node);
        information.push(`Namespace: ${node.data.data.data.namespace}`);
        break;

      case 'Container':
        const labels = node.data.label.split(': ');
        information.push(`Container name: ${labels[1]}`);
        break;

      default:
        information.push(`Label: ${node.data.label}`)
    }
    
    const dialog = dialogDescriptor(information);
    setShowAlert([true, dialog]);
  };

  /* ------------------------------------------------------------------------------------------------------------- */
  /* ---------------------------- JSX ELEMENTS TO RERENDER UPON DYNAMIC STYLE CHANGING --------------------------- */
  /* ------------------------------------------------------------------------------------------------------------- */

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

  const updatedNodes: Node[] = nodes.map((node) => ({
      ...node,
      style: {
        ...node.style,
        boxShadow: 
        selectedNodeId[0] == node.id && selectedNodeId[1] === 'glow'?
        '3px 3px 5px white, -3px -3px 5px white, 3px -3px 5px white, -3px 3px 5px white'
        : '0px 0px'
      }
  }));

  /* ------------------------------------------------------------------------------------------------------------- */
  /* ------------------------------------------ USING CLUSTER TIMELINE ------------------------------------------- */
  /* ------------------------------------------------------------------------------------------------------------- */
  // Grab new cluster history upon tree page refresh
  useEffect(() => { fetchHistory(); }, [k8sCluster]);

  //repopulate all nodes and edges upon clicking on previous cluster
  const handleSetClusterFromHistory = (pods: ClusterElement[], nodes: ClusterElement[], services: ClusterElement[]) => {
  
    //creating node array of WORKER NODES
    const newNodes: Node[] = nodes.map((node, index) => ({
      id: node.name,
      data: { label: `Worker Node: ${node.name}`, data: node},
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

    //connecting WORKER NODES to PODS
    nodes.forEach((workerNode) => {
      const workerNodeName = workerNode.name;
      if (!groupedPodsCache[workerNodeName]) {
        groupedPodsCache[workerNodeName] = [];
      } 
      groupedPodsCache[workerNodeName] = pods.filter((pod) => pod.data.nodeName === workerNodeName)
    })

    const newPods: Node[] = [];
  
    //creating node array of PODS
    Object.keys(groupedPodsCache).forEach((nodeName, nodeIndex) => {
      groupedPodsCache[nodeName].forEach((pod, podIndex) => {
        const xPosition = nodeIndex * 400 + 70;  
        const yPosition = 650 + podIndex * 75;
  
        newPods.push({
          id: pod.name,
          data: { label: `Pod: ${pod.name}`, data: pod },
          position: { x: xPosition, y: yPosition },
          style: { 
            border: '1px solid black', 
            padding: 10, 
            fontSize: 7,
            backgroundColor: 'green',
            boxShadow: '0px 0px',
           },
        });
      });
    });

    //creating node array of SERVICES
    const newServices: Node[] = services.map((service, index) => ({
      id: service.name,
      data: { label: `Service: ${service.name}`, data: service },
      position: { x: 1200, y: 400 + index * 75 },
      style: { 
        border: '1px solid black', 
        padding: 10, 
        fontSize: 7,
        backgroundColor: 'orange',
        boxShadow: '0px 0px',
        },
    }));

    //creating node array of CONTAINERS and corresponding edges
    const newContainerEdges: Edge[] = [];
    const newContainerNodes: Node[] = pods.flatMap((pod, podIndex) => {
      return pod.data.containers.map((container, containerIndex) => {
        const edgeId = `p-c-${pod.name}-${container}`
        newContainerEdges.push({
          id: edgeId,
          source: pod.name,
          target: container,
        });
        return {
          id: container,
          data: { label: `Container: ${container}` },
          position: { x: -200, y: 400 + (podIndex * 75) + (containerIndex * 75) },
          style: {
            border: '1px solid black', 
            padding: 10, 
            fontSize: 7,
            backgroundColor: 'white',
            boxShadow: '0px 0px',
          },
        };
      });
    });

    const newNodeEdges: Edge[] = k8sNodesList.map((node, index) => ({
      id: `el2-${index}`,
      source: 'api-server',
      target: node.name,
    }));

    const newPodEdges: Edge[] = pods.map((pod, index) => ({
      id: `el3-${index}`,
      source: pod.data.nodeName,
      target: pod.name,
    }))

    //creating edge array connecting SERVICES to PODS
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

    //rerender page through state change
    setNodes([...initialNodes, ...newNodes, ...newPods, ...newServices, ...newContainerNodes]);
    setEdges([...newNodeEdges, ...newPodEdges, ...newContainerEdges, ...newServiceEdges])
  }

  /* ------------------------------------------------------------------------------------------------------------- */
  /* ------------------------------------------------------------------------------------------------------------- */

  return (
    <>
      <div className ="flex flex-col mb-6 gap-2">
        <Heading>K8s Structure</Heading>
      {/* <div style={{ height: '750px' }}> */}
        <div>
          <Button className="m-1" color="superPurple" onClick={loadCluster}><ArrowDownTrayIcon/> Load Recent Cluster</Button> 
          <Button className="m-1" color="light" onClick={handleRefresh}><ArrowPathIcon />Update Cluster</Button>
          <Button className="m-1" color="light" onClick={handleSnapshot}><PlusIcon />Take Snapshot</Button>
        </div>
      </div>

      <div className="flex flex-col w-full min-h-screen items-stretch overflow-visible">
        {!firstLoad ? ( 
          <div className="flex-grow w-full h-[750px] border rounded-md dark: border-gray-700">
 
          <ReactFlow
            nodes={updatedNodes}
            edges={updatedEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            elementsSelectable={true}
            defaultViewport={defaultViewport}
            minZoom={0.2}
            maxZoom={4}
            onNodeMouseEnter={onNodeEnter}
            onNodeMouseLeave={onNodeLeave}
            onNodeClick={onNodeClick}
            style={{ width: '100%', height: '100%' }}
          >
            <Background />
            <Controls />
          </ReactFlow>
          </div>
        ) : (
          <span></span>
        )}

        {k8sClusterHistory.length > 0 ? (
          <div style={{ height: '100%', width: '100%', position: 'relative', marginTop: '20px' }}>
            <Chrono
              items={k8sClusterHistory.map((cluster) => ({
                title: new Date(cluster.created_at).toLocaleString()
              }))}
              mode="HORIZONTAL"
              allowDynamicUpdate={true}
              // enableDarkToggle={true}
              activeItemIndex={null}
              cardLess={true}
              toolbarPosition='BOTTOM'
              onItemSelected={(item) => {
                const selectedCluster = k8sClusterHistory.find((cluster) => new Date(cluster.created_at).toLocaleString() === item.title);
                if (selectedCluster) {
                  handleSetClusterFromHistory(selectedCluster.data.pods, selectedCluster.data.nodes, selectedCluster.data.services);
                }
              }}
              theme={{
                primary: 'grey',
                secondary: 'purple',
                cardBgColor: 'yellow',
                titleColor: 'gray',
                titleColorActive: 'white',
              }}
              fontSizes={{
                cardSubtitle: '0.85rem',
                cardText: '0.8rem',
                cardTitle: '0.9rem',
                title: '0.9rem',
              }}
              itemWidth={125}
              
              focusActiveItemOnLoad={true}
              onScrollEnd={()=>{}}
            />
          </div>
        ) : (
          <p>Grabbing history...</p> 
        )}

        {showAlert[0] && (
          <Dialog open={true} onClose={() => setShowAlert([false])} size="xl">
            <DialogTitle>Additional Information</DialogTitle>
            {showAlert[1]}
            <DialogActions>
              <Button onClick={() => setShowAlert([false])} className='btn btn-primary'>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
    </>
  )
}

export default Tree;