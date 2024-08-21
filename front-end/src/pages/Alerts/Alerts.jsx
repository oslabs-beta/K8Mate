import React from 'react'
import { useState, useEffect } from 'react'

function Alerts() {
  const [ cpuData, setCpuData ] = useState([]);
  const [ runningPods, setRunningPods ] = useState(null);
  const [ failedPods, setFailedPods ] = useState(0);
  const [ prevFailedPods, setPrevFailedPods ] = useState(0);
  const [ restartedPod, setRestartedPods ] = useState(0);
  const [ prevRestartedPod, setPrevRestartedPods ] = useState(0)

  //node sessions 
  useEffect(() => {
    const nodeSessions = async () => {
      try {
      const response = await fetch('http://localhost:9090/api/v1/query?query=count(kube_node_info)')
      const data = await response.json();
      console.log('node sessions', data)
      }
      catch(err) {
        console.log(err)
      }
    }
    nodeSessions();
  }, [])

  // grab CPU usage per node
  useEffect(() => {
    const cpuUsage = async () => {
      try {
        const response = await fetch('http://localhost:9090/api/v1/query?query=100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[10m]) * 100) * on(instance) group_left(nodename) (node_uname_info))');
        const data = await response.json();
        // iterate over result index number for each node
        for (let i = 0; i < data.data.result.length; i++){
          const cpuUsageValue = data.data.result[i].value[1];
          console.log(cpuUsageValue);
          // alert base case
          setCpuData(cpuUsageValue);
          if (cpuUsageValue > cpuThreshold) {
            cpuAlert(cpuUsageValue);
        }

        }
        console.log('cpu usuage', data)
      }
      catch(err){
        console.log(err)
      }
    }
    cpuUsage();
  }, [])

  const cpuThreshold = 80;
  const cpuAlert = () => {
    alert('CPU Usage is too high!')
  }

  // grab amount of time pods restarted
  useEffect(() => {
    const podRestart = async () => {
      try {
        const response = await fetch('http://localhost:9090/api/v1/query?query=increase(kube_pod_container_status_restarts_total[5m])');
        const data = await response.json();
        // setCpuData(data);
        // console.log('pod restarts', data)
        let podRestartCount = 0;
        for (let i = 0; i < data.data.result.length; i++) {
          // let podRestartCount = data.data.results[i].value[1];
          // if (podRestartCount > 0){
          //   podAlert();
          // }
          podRestartCount += Number(data.data.result[i].value[1])
        }
        setRestartedPods(podRestartCount);
      }
      catch(err){
        console.log(err)
      }
    }
    podRestart();
    const intervalID = setInterval(() => {
      podRestart();
    }, 5000)

    return () => clearInterval(intervalID);
  }, [])

  //checks if current restart pod count is greater than prev restart pod count
  useEffect(() => {
    if (restartedPod > prevRestartedPod) {
      console.log('Pod has restarted');
      podAlert();
      setPrevRestartedPods(restartedPod)
    }
  }, [restartedPod])

  const podAlert = () => {
    alert('A pod just restarted')
  }
 
  // grab number of running pods
  useEffect(() => {
    const runningPods = async () => {
      try {
        const response = await fetch('http://localhost:9090/api/v1/query?query=count(kube_pod_status_phase{phase="Running"})');
        const data = await response.json();
        console.log('number of running pods', data);
        setRunningPods(data.data.result[0].value[1]);
      }
      catch(err){
        console.log(err)
      }
    }
    runningPods();
  }, [])

  //failed pods
  useEffect(() => {
    const failedPods = async () => {
      try {
        const response = await fetch('http://localhost:9090/api/v1/query?query=sum(kube_pod_status_phase{phase="Failed"})');
        const data = await response.json();
        // console.log('failed pods', data);
        setFailedPods(Number(data.data.result[0].value[1]));
      }
      catch(err) {
        console.log(err)
      }
    }
    failedPods();
    const intervalID = setInterval(() => {
      failedPods();
    }, 5000)

    return () => clearInterval(intervalID);
  }, [])

  //checks to see if current pods failed is greater than previous failed pods count
  useEffect(() => {
    if (failedPods > prevFailedPods) {
      console.log('Pod has failed');
      alert('Pod has failed');
      setPrevFailedPods(failedPods)
    }
  }, [failedPods])

  //running containers
  useEffect(() => {
    const runningContainers = async () => {
      try {
        const response = await fetch('http://localhost:9090/api/v1/query?query=count(container_last_seen)');
        const data = await response.json();
        console.log('running containers', data)
      }
      catch(err) {
        console.log(err)
      }
    }
    runningContainers();
  }, [])

  return (
    <>
    <div>Alerts - just trying to display data now</div>
    <h1>Running Pods: {runningPods}</h1>
    <h1>Failed Pods: {failedPods}</h1>
    </>
  )
}

export default Alerts