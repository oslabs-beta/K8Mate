import react, { createContext, useState, useEffect, useRef } from 'react';

const AlertsContext = createContext();

const AlertsProvider = ({ children }) => {
  const [ cpuData, setCpuData ] = useState([]);
  const [ runningPods, setRunningPods ] = useState(null);
  const [ podDetails, setPodDetails] = useState([]); //array of pod names to compare
  const [ prevPodDetails, setPrevPodDetails ] = useState([]);
  const [ alertList, setAlertList ] = useState([]);
  const [ alertsUnreadStatus, setAlertsUnreadStatus] = useState(false)
  // const hasFetchedCpuData = useRef(false);

  // Function to update alertsUnreadStatus
  const updateAlertsUnreadStatus = (status) => {
    setAlertsUnreadStatus(status);
  };

 
  // alerts requests to backend
  //cpu POST
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
    } catch (err) {
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
    } catch (err) {
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
          log: `${restartedPod} has restarted`,
        })
      });
      if (response.ok){
        console.log('Restarted pod alert was sent successfully');
      } else {
        console.log('Restarted pod alert failed to send');
      }
    } catch (err) {
      console.log(err);
    }
  }


  //grab details of all current pods
  useEffect(() => {
    const pods = async () => {
      try {
        const response = await fetch('http://localhost:9090/api/v1/query?query=kube_pod_info')
        const data = await response.json();
        // console.log('pod descriptions', data)
        const podData = data.data.result.map((pod) => {
          return {
          podName: pod.metric.pod,
          podID: pod.metric.uid
          };
        });
        setPodDetails(podData);
      }
      catch(err) {
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
        console.log('DATA', data);
        const cpuUsagePerNode = data.data.result.map((cpuUse) => ({
          nodeName: cpuUse.metric.nodename,
          cpuUsage: cpuUse.value[1],
        }))
        console.log(cpuUsagePerNode);

        setCpuData(cpuUsagePerNode);
       
      } catch (err) {
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

  useEffect(() => {
    const fetchAlerts = async () => {
      try{
        const response = await fetch('http://localhost:8080/alert/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (response.ok) {
          const alerts = await response.json()
          const hasReadTrue = alerts.some(alert => alert.read ==='unread')

          if (hasReadTrue) {
            setAlertsUnreadStatus(hasReadTrue)
          } else {
            setAlertsUnreadStatus(false)
          }
        }
      } catch(err) {
        console.log(err);
      }
    }
    fetchAlerts();
  }, [])


  const contextValue = {
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