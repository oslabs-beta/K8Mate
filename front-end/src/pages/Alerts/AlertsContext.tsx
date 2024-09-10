import React, { createContext, useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogDescription, DialogActions } from '../../components/template/catalyst/dialog'
import { Button } from '../../components/template/catalyst/button'

type AlertsContextsValues = {
  diskSpace: DiskData[],
  cpuData: CpuData[],
  podDetails: PodDetails[],
  alertList: string[]
  alertsUnreadStatus: Boolean
  updateAlertsUnreadStatus: (status: Boolean) => void
}

const AlertsContext = createContext<AlertsContextsValues | undefined>(undefined);

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
  const [ podDetails, setPodDetails] = useState<PodDetails[]>([]); 
  const [ prevPodDetails, setPrevPodDetails ] = useState<PodDetails[]>([]);
  const [ alertList, setAlertList ] = useState<string[]>([]);
  const [ alertsUnreadStatus, setAlertsUnreadStatus ] = useState<Boolean>(false)
  const [ alertMessage, setAlertMessage ] = useState<string>("");
  const [ showAlert, setShowAlert ] = useState<Boolean>(false);

  // Function to update alertsUnreadStatus
  const updateAlertsUnreadStatus = (status: Boolean) => {
    setAlertsUnreadStatus(status);
  };

  //query for current memeory on each worker node

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
        handleMemAlert(mem.nodeName, mem.memNum)
      }
    });
  }, [availableMemory]);

  //available memory POST request

  const sendAvailMemAlert = async (memoryNumber, nodeName) => {
    try {
      const formattedDate = new Date().toLocaleString();
      const response = await fetch('http://localhost:8080/alert/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category: 'Memory',
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

  //alert popup for available memory

  const handleMemAlert = (nodeName, memory) => {
    setAlertMessage(`Low memory detected on node ${nodeName}. Current available memory is ${memory}.`);
    setShowAlert(true);
  }

  //query current cpu stats

  useEffect(() => {
    const cpuUsage = async () => {
      try {
        const response = await fetch('http://localhost:9090/api/v1/query?query=100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[10m]) * 100) * on(instance) group_left(nodename) (node_uname_info))');
        if (!response.ok){
          console.log('Failed Fetch');
          return
        }
        const data = await response.json();
        const cpuUsagePerNode: CpuData[] = data.data.result.map((cpuUse) => ({
          nodeName: cpuUse.metric.nodename,
          cpuUsage: cpuUse.value[1],
        }))
        setCpuData(cpuUsagePerNode);
      } catch (err: unknown) {
        console.log(err);
      }
    };
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
        handleCpuAlert(cpuValue.cpuUsage, cpuValue.nodeName)
      }
    })
  }, [cpuData])
  
  //sends cpu alert message to backend

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

  //handler for cpu alert popup

  const handleCpuAlert = (cpuUsageValue, nodeName) => {
    setAlertMessage(`CPU usage is high: ${nodeName} is at ${cpuUsageValue}%`);
    setShowAlert(true);
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
    }, 5000)

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
        prevPod.podName === currentPod.podName && prevPod.podID === currentPod.podID
      )
    );
    if (failedPod.length > 0 && podDetails.length === prevPodDetails.length) {
      podFailedAlert(failedPod[0].podName, failedPod[0].podID);
      podRestartAlert(restartedPod[0].podName, restartedPod[0].podID)
      handlePodAlert(failedPod[0], restartedPod[0])
    }
    setPrevPodDetails(podDetails);
  }, [podDetails])

  const handlePodAlert = (failedPod, startedPod) => {
    setAlertMessage(`Pod "${failedPod.podName}" has failed and has been restarted with "${startedPod.podName}"`);
    setShowAlert(true);
  }

  //query current incoming and outgoing traffic
  useEffect(() => {
    const networkTrafficData = async () => {
      try {
        const query = encodeURIComponent(`sum by (instance) (
          rate(node_network_receive_bytes_total{device!="lo"}[1m]) +
          rate(node_network_transmit_bytes_total{device!="lo"}[1m])
        )`);
        const response = await fetch(`http://localhost:9090/api/v1/query?query=${query}`);
        if (!response.ok){
          console.log('Failed Fetch');
          return
        }
        const data = await response.json();
        console.log('NETWORK DATA', data)
        if (data.status === 'success' && data.data.result.length > 0) {
          const trafficData: NetworkData[] = data.data.result.map(result => ({
            nodeName: result.metric.instance,
            bitsPerSecond: Number(result.value[1])
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
        handleNetworkTrafficAlert(traffic.bitsPerSecond, traffic.nodeName);
      }
    });
  }, [networkTraffic]);

  //sends network traffic alert message to backend
  
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
          category: 'Network',
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

  //handler for network traffic popup

  const handleNetworkTrafficAlert = (bits, nodeName) => {
    setAlertMessage(`High network traffic detected at ${bits} bits per second on ${nodeName}`);
    setShowAlert(true);
  }

 //query current disk space

  useEffect(() => {
    const lowDiskSpace = async () => {
      try {
        const response = await fetch('http://localhost:9090/api/v1/query?query=100 * (node_filesystem_size_bytes{fstype!~"tmpfs|overlay", mountpoint="/"} - node_filesystem_avail_bytes{fstype!~"tmpfs|overlay", mountpoint="/"}) / node_filesystem_size_bytes{fstype!~"tmpfs|overlay", mountpoint="/"}');
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
        handleDiskSpaceAlert(diskValue.diskNum, diskValue.nodeName)
      }
    })
  }, [diskSpace])

  //sends disk space alert message to backend

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

  //handler for disk space popup

  const handleDiskSpaceAlert = (diskSpaceNum, nodeName) => {
    setAlertMessage(`Disk space usage is high at ${diskSpaceNum}% on ${nodeName}.`);
    setShowAlert(true);
  }
 
  //fetch all current alerts to display

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
    podDetails,
    alertList,
    alertsUnreadStatus,
    updateAlertsUnreadStatus,  // Passing the update function through context
  };

  return (
    <AlertsContext.Provider value={contextValue}>
      {children}
      {showAlert && (
        <Dialog open={true} onClose={() => setShowAlert(false)} size="xl">
          <DialogTitle>Alert</DialogTitle>
          <DialogDescription>{alertMessage}</DialogDescription>
          <DialogActions>
            <Button onClick={() => setShowAlert(false)} className='btn btn-primary'>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </AlertsContext.Provider>
  );

}

export { AlertsProvider, AlertsContext };