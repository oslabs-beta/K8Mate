import React, { createContext, useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogDescription, DialogActions } from '../../components/template/catalyst/dialog'
import { Button } from '../../components/template/catalyst/button'
import { createAlert, getAlerts, promQuery } from '../../services/alertsService.ts';
import { AvailMem, PodDetails, NetworkData, DiskData, CpuData } from '../../../fronttypes.ts'

type AlertsContextsValues = {
  diskSpace: DiskData[],
  cpuData: CpuData[],
  podDetails: PodDetails[],
  alertList: string[]
  alertsUnreadStatus: Boolean
  updateAlertsUnreadStatus: (status: Boolean) => void
}

const AlertsContext = createContext<AlertsContextsValues | undefined>(undefined);

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

/* ------------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------- FETCH REQUESTS USING PROMQL  --------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------- */

  // Fetch request to get Memory Available in Bytes
  useEffect(() => {
    const availMem = async () => {
      try {
        const query = encodeURIComponent('node_memory_MemAvailable_bytes');
        const data = await promQuery(query);
        
        const memData: AvailMem[] = data.data.result.map((mem) => {
          return {
            nodeName: mem.metric.instance,
            memNum: mem.value[1]
          }
        });
        setAvailableMemory(memData)
  
      } catch(err: unknown) { console.log(err) }
    }
    availMem();
    const intervalID = setInterval(availMem, 5000);
    return () => clearInterval(intervalID);
  }, [])

  // Fetch request to measure CPU usage
  useEffect(() => {
    const cpuUsage = async () => {
      try {
        const query = '100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[10m]) * 100) * on(instance) group_left(nodename) (node_uname_info))';
        const data = await promQuery(query);
        
        const cpuUsagePerNode: CpuData[] = data.data.result.map((cpuUse) => ({
          nodeName: cpuUse.metric.nodename,
          cpuUsage: cpuUse.value[1],
        }))
        setCpuData(cpuUsagePerNode);
      } catch (err: unknown) { console.log(err); }
    };
    const intervalID = setInterval(() => {
      cpuUsage()
    }, 5000)
    return () => clearInterval(intervalID);
  }, []);

  // Fetch request to grab all current pods
  useEffect(() => {
    const pods = async () => {
      try {
        const data = await promQuery('kube_pod_info');
        
        const podData: PodDetails[] = data.data.result.map((pod) => {
          return {
          podName: pod.metric.pod,
          podID: pod.metric.uid
          };
        });
        setPodDetails(podData);
      }
      catch(err: unknown) { console.log(err); }
    }
    pods();
    const intervalID = setInterval(() => {
      pods()
    }, 5000)

    return () => clearInterval(intervalID);
  }, [])

  // Fetch request for current ingoing and outgoing traffic data in bytes
  useEffect(() => {
    const networkTrafficData = async () => {
      try {
        const query = encodeURIComponent(`sum by (instance) (
          rate(node_network_receive_bytes_total{device!="lo"}[1m]) +
          rate(node_network_transmit_bytes_total{device!="lo"}[1m])
        )`);
        const data = await promQuery(query);
        
        console.log('NETWORK DATA', data)
        if (data.status === 'success' && data.data.result.length > 0) {
          const trafficData: NetworkData[] = data.data.result.map(result => ({
            nodeName: result.metric.instance,
            bitsPerSecond: Number(result.value[1])
          }));
          setNetworkTraffic(trafficData);
        } else { console.log('No data available or query failed.'); }
      } catch (err: unknown) { console.log('Error fetching network traffic data:', err); }
    };
  
    networkTrafficData();
    const intervalID = setInterval(networkTrafficData, 5000);
    return () => clearInterval(intervalID);
  }, []);

  // Fetch request for the amount of disk space being used for no
  useEffect(() => {
    const lowDiskSpace = async () => {
      try {
        const query = '100 * (node_filesystem_size_bytes{fstype!~"tmpfs|overlay", mountpoint="/"} - node_filesystem_avail_bytes{fstype!~"tmpfs|overlay", mountpoint="/"}) / node_filesystem_size_bytes{fstype!~"tmpfs|overlay", mountpoint="/"}';
        const data = await promQuery(query);
        // const response = await fetch('http://localhost:9090/api/v1/query?query=100 * (node_filesystem_size_bytes{fstype!~"tmpfs|overlay", mountpoint="/"} - node_filesystem_avail_bytes{fstype!~"tmpfs|overlay", mountpoint="/"}) / node_filesystem_size_bytes{fstype!~"tmpfs|overlay", mountpoint="/"}');
        // if (!response.ok){ throw new Error ('Failed Fetch'); }

        // const data = await response.json();
        console.log('DISK SPACE ALERT:', data);
        const diskData: DiskData[] = data.data.result.map((disk) => ({
          nodeName: disk.metric.instance,
          diskNum: disk.value[1]
        }))
        setDiskSpace(diskData)
      } catch (err: unknown) { console.log(err); }
    };
    lowDiskSpace();
    const intervalID = setInterval(lowDiskSpace, 5000);
    return () => clearInterval(intervalID);
  }, []);

/* ------------------------------------------------------------------------------------------------------------- */
/* --------------------------------------- CHECKS TO CREATE CUSTOM ALERTS  ------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------- */

  // Check if available memory is above the 1GB threshold
  useEffect(() => {
    const memoryThreshold = 1073741824; // 1gb threshold
    availableMemory.forEach(mem => {
      if (mem.memNum < memoryThreshold) {
        sendAvailMemAlert(mem.memNum, mem.nodeName);
        handleMemAlert(mem.nodeName, mem.memNum)
      }
    });
  }, [availableMemory]);

  // Check if CPU usage is above 60%
  useEffect(() => {
    const cpuThreshold = 60;
    cpuData.forEach(cpuValue => {
      if (cpuValue.cpuUsage > cpuThreshold) {
        sendCpuAlert(cpuValue.cpuUsage, cpuValue.nodeName)
        handleCpuAlert(cpuValue.cpuUsage, cpuValue.nodeName)
      }
    })
  }, [cpuData])

  // Check if current podName array is different from previous podName array
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

  // Checks if the amount of traffic received is greater than the 1GB threshold
  useEffect(() => {
    const trafficThreshold = 1000000000; // 1 gbps threshold
    networkTraffic.forEach(traffic => {
      if (traffic.bitsPerSecond > trafficThreshold) {
        sendNetworkTrafficAlert(traffic.bitsPerSecond, traffic.nodeName);
        handleNetworkTrafficAlert(traffic.bitsPerSecond, traffic.nodeName);
      }
    });
  }, [networkTraffic]);

  // Check if the disk space being used is above 85%
  useEffect(() => {
    const diskSpacePercentage = 85;
    diskSpace.forEach(diskValue => {
      if (diskValue.diskNum > diskSpacePercentage) {
        sendDiskValueAlert(diskValue.diskNum, diskValue.nodeName)
        handleDiskSpaceAlert(diskValue.diskNum, diskValue.nodeName)
      }
    })
  }, [diskSpace])


/* ------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------- CREATE ALERTS POPUP  ------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------- */

 // Alert popup for high memory usage
  const handleMemAlert = (memUsageValue, nodeName) => {
    setAlertMessage(`Memory usage is high: ${nodeName} is at ${memUsageValue}`)
    setShowAlert(true)
  }

 // Alert popup for high CPU usage
  const handleCpuAlert = (cpuUsageValue, nodeName) => {
    setAlertMessage(`CPU usage is high: ${nodeName} is at ${cpuUsageValue}%`);
    setShowAlert(true);
  }

  // Alert popup for failed pod and newly started pod
  const handlePodAlert = (failedPod, startedPod) => {
    setAlertMessage(`Pod "${failedPod.podName}" has failed and has been restarted with "${startedPod.podName}"`);
    setShowAlert(true);
  }

  // Alert popup for high network traffic
  const handleNetworkTrafficAlert = (bits, nodeName) => {
    setAlertMessage(`High network traffic detected at ${bits} bits per second on ${nodeName}`);
    setShowAlert(true);
  }

  // Alert popup for low disk space
  const handleDiskSpaceAlert = (diskSpaceNum, nodeName) => {
    setAlertMessage(`Disk space usage is high at ${diskSpaceNum}% on ${nodeName}.`);
    setShowAlert(true);
  }


/* ------------------------------------------------------------------------------------------------------------- */
/* ------------------------------------------ POST REQUESTS TO BACKEND ----------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------- */
  
  // Post request for Low Memory Number
  const sendAvailMemAlert = async (memoryNumber, nodeName) => {
    try {
      const formattedDate = new Date().toLocaleString();
      const response = await createAlert('Memory', nodeName, 
        `Low memory detected on node ${nodeName} at ${formattedDate}. Current available memory is ${memoryNumber}.`);
      console.log('Memory alert sent successfully');
    } catch (err: unknown) { console.log(err) }
  }
  // POST request for high CPU Usage Alert
  const sendCpuAlert = async (cpuUsageValue, nodeName) => {
    try {
      const formattedDate = new Date().toLocaleString();
      const formattedCpuUsageValue = Number(cpuUsageValue).toFixed(2);
      const response = await createAlert('CPU', nodeName, `CPU usage is high: ${formattedCpuUsageValue}% at ${formattedDate}`);
      console.log('CPU alert was sent successfully');
    } catch (err: unknown) { console.log(err); }
  }

  // POST request for Failed Alert
  const podFailedAlert = async (failedPod, failedPodID) => {
    try {
      const response = await createAlert('Pod', failedPod, `${failedPod} has failed`, failedPodID);
      console.log('Failed pod alert was sent successfully');
    } catch (err: unknown) { console.log(err); }
  }

  // POST request for Restarted Pod
  const podRestartAlert = async (restartedPod, restartedPodID) => {
    try {
      const response = await createAlert('Pod', restartedPod, restartedPodID, `${restartedPod} has started`);
      console.log('Restarted pod alert was sent successfully');
    } catch (err: unknown) { console.log(err); }
  }

  // POST request for Network Traffic Alert
  const sendNetworkTrafficAlert = async (bitsPerSecond, nodeName) => {
    try {
      const formattedDate = new Date().toLocaleString();
      const formattedBitsRate = Number(bitsPerSecond).toFixed(2);
      const response = await createAlert('Network', nodeName, 
        `High network traffic detected at ${formattedBitsRate} bits per second on ${nodeName} on ${formattedDate}`);
      console.log('Network traffic alert was sent successfully');
    } catch (err: unknown) { console.log(err); }
  };

  // POST request for Disk Value Alert
  const sendDiskValueAlert = async (diskSpaceNum, nodeName) => {
    try {
      const formattedDate = new Date().toLocaleString();
      const formattedDiskSpace = Number(diskSpaceNum).toFixed(2);
      const response = await createAlert('Disk', nodeName, 
        `Disk space usage is high at ${formattedDiskSpace}% on ${nodeName} on ${formattedDate}`);
      console.log('Disk Space alert was sent successfully');
    } catch (err: unknown) { console.log(err); }
  }

  useEffect(() => {
    setPrevPodDetails(podDetails)
  }, [])


/* ------------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------- REQUEST TO LIST ALL ALERTS  ---------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------- */

  useEffect(() => {
    const fetchAlerts = async () => {
      try{
        const alerts = await getAlerts();
        const hasReadTrue = alerts.some(alert => alert.read ==='unread')
        hasReadTrue? setAlertsUnreadStatus(hasReadTrue) : setAlertsUnreadStatus(false);
      } catch(err: unknown) { console.log(err); }
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