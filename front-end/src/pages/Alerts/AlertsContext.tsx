import React, { createContext, useState, useEffect, useRef } from 'react';

const AlertsContext = createContext();

type AvailMem = {
  nodeName: string,
  memNum: number
}

type PodDetails = {
  podName: string,
  podID: number
}

type NetworkData = {
  nodeName: string,
  bitsPerSecond: number
}

type DiskData = {
  nodeName: string,
  diskNum: number
}

type CpuData = {
  nodeName: string,
  cpuUsage: number
}
const AlertsProvider = ({ children }) => {

  const [ availableMemory, setAvailableMemory ] = useState<AvailMem[]>([])
  const [ networkTraffic, setNetworkTraffic ] = useState<NetworkData[]>([])
  const [ diskSpace, setDiskSpace ] = useState<DiskData[]>([])
  const [ cpuData, setCpuData ] = useState<CpuData[]>([]);
  const [ runningPods, setRunningPods ] = useState(null);
  const [ podDetails, setPodDetails] = useState<PodDetails[]>([]); //array of pod names to compare
  const [ prevPodDetails, setPrevPodDetails ] = useState<PodDetails[]>([]);
  const [ alertList, setAlertList ] = useState<string[]>([]);
  const [ alertsUnreadStatus, setAlertsUnreadStatus] = useState<Boolean>(false)
  // const hasFetchedCpuData = useRef(false);

  // Function to update alertsUnreadStatus
  const updateAlertsUnreadStatus = (status) => {
    setAlertsUnreadStatus(status);
  };

 
  // alerts requests to backend
  //cpu POST

  useEffect(() => {
    const availMem = async () => {
      try {
        const query = encodeURIComponent('node_memory_MemAvailable_bytes');
        const response = await fetch(`http://localhost:9090/api/v1/query?query=${query}`);
        if (!response.ok){
          console.log('Failed Fetch');
          return
        }
        const data = await response.json();
        // console.log("READ THIS SHIT HERE", data)
        const memData: AvailMem[] = data.data.result.map((mem) => {
          return {
            nodeName: mem.metric.instance,
            memNum: mem.value[1]
          }
        });
        setAvailableMemory(memData)
  
      } catch(err: unknown) {
        console.log(err)
      }
    }
    availMem();
    const intervalID = setInterval(availMem, 5000);
    return () => clearInterval(intervalID);
  }, [])

  useEffect(() => {
    const memoryThreshold = 1073741824; // 1gb threshold
    availableMemory.forEach(mem => {
      if (mem.memNum < memoryThreshold) {
        sendAvailMemAlert(mem.memNum, mem.nodeName);
      }
    });
  }, [availableMemory]);

  const sendAvailMemAlert = async (memoryNumber, nodeName) => {
    try {
      const formattedDate = new Date().toLocaleString();
      const response = await fetch('http://localhost:8000/alert/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category: 'Node',
          name: nodeName,
          log: `Low memory detected on node ${nodeName} at ${formattedDate}. Current available memory is ${memoryNumber}.`
        })
      });
      if (response.ok){
        console.log('Memory alert sent successfully')
      } else {
        console.log('Memory alert failed to send')
      }
    } catch (err: unknown) {
      console.log(err)
    }
  }



  const sendCpuAlert = async (cpuUsageValue, nodeName) => {
    try {
      const formattedDate = new Date().toLocaleString();
      const formattedCpuUsageValue = Number(cpuUsageValue).toFixed(2);
      const response = await fetch ('http://localhost:8080/alert/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category: 'CPU',
          name: nodeName,
          log: `CPU usage is high: ${formattedCpuUsageValue}% at ${formattedDate}`
        })
      });
      if (response.ok){
        console.log('CPU alert was sent successfully');
      } else {
        console.log('CPU alert failed to send');
      }
    } catch (err: unknown) {
      console.log(err);
    }
  }

  //pod fail POST
  const podFailedAlert = async (failedPod, failedPodID) => {
    try {
      const response = await fetch ('http://localhost:8080/alert/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // pod id, previous pod name, alert log, category: pods
          id: failedPodID,
          category: 'Pod',
          name: failedPod,
          log: `${failedPod} has failed`
        })
      });
      if (response.ok){
        console.log('Failed pod alert was sent successfully');
      } else {
        console.log('Failed pod alert failed to send');
      }
    } catch (err: unknown) {
      console.log(err);
    }
  }


  //pod restart POST
  const podRestartAlert = async (restartedPod, restartedPodID) => {
    try {
      const response = await fetch ('http://localhost:8080/alert/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // pod id, previous pod name, alert log, category: pods
          id: restartedPodID,
          category: 'Pod',
          name: restartedPod,
          log: `${restartedPod} has started`,
        })
      });
      if (response.ok){
        console.log('Restarted pod alert was sent successfully');
      } else {
        console.log('Restarted pod alert failed to send');
      }
    } catch (err: unknown) {
      console.log(err);
    }
  }


  //grab details of all current pods
  useEffect(() => {
    const pods = async () => {
      try {
        const response = await fetch('http://localhost:9090/api/v1/query?query=kube_pod_info')
        if (!response.ok){
          console.log('Failed Fetch');
          return
        }
        const data = await response.json();
        // console.log('pod descriptions', data)
        const podData: PodDetails[] = data.data.result.map((pod) => {
          return {
          podName: pod.metric.pod,
          podID: pod.metric.uid
          };
        });
        setPodDetails(podData);
      }
      catch(err: unknown) {
        console.log(err)
      }
    }
    pods();
    const intervalID = setInterval(() => {
      pods()
    }, 20000)

    return () => clearInterval(intervalID);
  }, [])

  //set previous pod names to current at startup
  useEffect(() => {
    setPrevPodDetails(podDetails)
  }, [])

  //checks if current pod name array is different from prev pod name array
  useEffect(() => {
    const failedPod = prevPodDetails.filter(prevPod =>
      !podDetails.some(currentPod => 
        currentPod.podName === prevPod.podName && currentPod.podID === prevPod.podID
      )
    );
    const restartedPod = podDetails.filter(currentPod => 
      !prevPodDetails.some(prevPod => 
        // prevPod[0] === currentPod[0] && prevPod[1] === currentPod[1]
        prevPod.podName === currentPod.podName && prevPod.podID === currentPod.podID
      )
    );
    // console.log('failed', failedPod)
    // console.log('restart', restartedPod)
    // console.log(podDetails)
    // console.log(prevPodDetails)
    if (failedPod.length > 0 && podDetails.length === prevPodDetails.length) {
      podFailedAlert(failedPod[0].podName, failedPod[0].podID);
      podRestartAlert(restartedPod[0].podName, restartedPod[0].podID)
      alert(`Pod "${failedPod[0].podName}" has failed and has been restarted with "${restartedPod[0].podName}"`)
    }
    setPrevPodDetails(podDetails);
  }, [podDetails])


  // network traffic
  useEffect(() => {
    const networkTrafficData = async () => {
      try {
        const query = encodeURIComponent('(irate(node_network_receive_bytes_total[1m]) + irate(node_network_transmit_bytes_total[1m]))');
        const response = await fetch(`http://localhost:9090/api/v1/query?query=${query}`);
        if (!response.ok){
          console.log('Failed Fetch');
          return
        }
        const data = await response.json();
        if (data.status === 'success' && data.data.result.length > 0) {
          const trafficData: NetworkData[] = data.data.result.map(result => ({
            nodeName: result.metric.instance,
            bitsPerSecond: parseFloat(result.value[1]) * 8 
          }));
          setNetworkTraffic(trafficData);
        } else {
          console.log('No data available or query failed.');
        }
      } catch (err: unknown) {
        console.log('Error fetching network traffic data:', err);
      }
    };
  
    networkTrafficData();
    const intervalID = setInterval(networkTrafficData, 5000);
    return () => clearInterval(intervalID);
  }, []);
  
  useEffect(() => {
    const trafficThreshold = 1000000000; // 1 gbps threshold
    networkTraffic.forEach(traffic => {
      if (traffic.bitsPerSecond > trafficThreshold) {
        sendNetworkTrafficAlert(traffic.bitsPerSecond, traffic.nodeName);
      }
    });
  }, [networkTraffic]);
  
  const sendNetworkTrafficAlert = async (bitsPerSecond, nodeName) => {
    try {
      const formattedDate = new Date().toLocaleString();
      const formattedBitsRate = Number(bitsPerSecond).toFixed(2);
      const response = await fetch('http://localhost:8080/alert/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category: 'Nodes',
          name: nodeName,
          log: `High network traffic detected at ${formattedBitsRate} bits per second on ${nodeName} on ${formattedDate}`
        })
      });
      if (response.ok) {
        console.log('Network traffic alert was sent successfully');
      } else {
        console.log('Network traffic alert failed to send');
      }
    } catch (err: unknown) {
      console.log(err);
    }
  };


 // lowDiskSpaace

  useEffect(() => {
    const lowDiskSpace = async () => {
      try {
        const response = await fetch('http://localhost:9090/api/v1/query?query=100*(1-(node_filesystem_avail_bytes/node_filesystem_size_bytes))');
        if (!response.ok){
          console.log('Failed Fetch');
          return
        }
        const data = await response.json();
        console.log('DISK SPACE ALERT:', data);
        const diskData: DiskData[] = data.data.result.map((disk) => ({
          nodeName: disk.metric.instance,
          diskNum: disk.value[1]
        }))
        // console.log('HER EHERE HERE HERE' + diskData)
        setDiskSpace(diskData)
      } catch (err: unknown) {
        console.log(err);
      }
    };
    lowDiskSpace();
    const intervalID = setInterval(lowDiskSpace, 5000);
    return () => clearInterval(intervalID);
  }, []);

  useEffect(() => {
    const diskSpacePercentage = 85;
    diskSpace.forEach(diskValue => {
      if (diskValue.diskNum > diskSpacePercentage) {
        sendDiskValueAlert(diskValue.diskNum, diskValue.nodeName)
      }
    })
  }, [diskSpace])

  const sendDiskValueAlert = async (diskSpaceNum, nodeName) => {
    try {
      const formattedDate = new Date().toLocaleString();
      const formattedDiskSpace = Number(diskSpaceNum).toFixed(2);
      const response = await fetch ('http://localhost:8080/alert/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category: 'Disk',
          name: nodeName,
          log: `Disk space usage is high at ${formattedDiskSpace}% on ${nodeName} on ${formattedDate}`
        })
      });
      if (response.ok){
        console.log('Disk Space alert was sent successfully');
      } else {
        console.log('Disk Space alert failed to send');
      }
    } catch (err: unknown) {
      console.log(err);
    }
  }


  // grab CPU usage per node

  useEffect(() => {
    const cpuUsage = async () => {
      try {
        const response = await fetch('http://localhost:9090/api/v1/query?query=100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[10m]) * 100) * on(instance) group_left(nodename) (node_uname_info))');
        if (!response.ok){
          console.log('Failed Fetch');
          return
        }
        const data = await response.json();
        // console.log('DATA', data);
        const cpuUsagePerNode: CpuData[] = data.data.result.map((cpuUse) => ({
          nodeName: cpuUse.metric.nodeName,
          cpuUsage: cpuUse.value[1],
        }))
        setCpuData(cpuUsagePerNode);
      } catch (err: unknown) {
        console.log(err);
      }
    };
    // if (!hasFetchedCpuData.current) {
    //   cpuUsage();
    //   hasFetchedCpuData.current = true;
    // }
    const intervalID = setInterval(() => {
      cpuUsage()
    }, 5000)
    return () => clearInterval(intervalID);
  }, []);

  useEffect(() => {
    const cpuThreshold = 60;
    cpuData.forEach(cpuValue => {
      if (cpuValue.cpuUsage > cpuThreshold) {
        sendCpuAlert(cpuValue.cpuUsage, cpuValue.nodeName)
      }
    })
  }, [cpuData])
 
  // grab number of running pods

  useEffect(() => {
    const fetchAlerts = async () => {
      try{
        const response = await fetch('http://localhost:8080/alert/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (!response.ok){
          console.log('Failed Fetch');
          return;
        }
        const alerts = await response.json()
        const hasReadTrue = alerts.some(alert => alert.read ==='unread')
        if (hasReadTrue) {
          setAlertsUnreadStatus(hasReadTrue)
        } else {
          setAlertsUnreadStatus(false)
        }
      } catch(err: unknown) {
        console.log(err);
      }
    }
    fetchAlerts();
  }, [])


  const contextValue = {
    diskSpace,
    cpuData,
    runningPods,
    podDetails,
    alertList,
    alertsUnreadStatus,
    updateAlertsUnreadStatus,  // Passing the update function through context
  };

  return (
    <AlertsContext.Provider value={contextValue}>
      {children}
    </AlertsContext.Provider>
  );

}

export { AlertsProvider, AlertsContext };