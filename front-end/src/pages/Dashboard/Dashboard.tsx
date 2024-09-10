import React, { useState, useEffect } from 'react';
import DashboardRow from '../../components/custom/DashboardRow/DashboardRow.tsx';
import { Heading } from '../../components/template/catalyst/heading.tsx';
import styles from './Dashboard.module.css';

function Dashboard(props) {
  const [graphState, setGraphState] = useState<string>('default');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loadedIframes, setLoadedIframes] = useState<number>(0);

  const handleChangeGraph = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGraphState(e.target.value);
    setLoadedIframes(0); // Reset iframe loading state when changing graph state
  };

  // Function to handle iframe errors and retry after 5 seconds
  const handleIframeError = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    setErrorMessage('Some content failed to load. Retrying...');
    
    // Retry loading the iframe after 5 seconds
    setTimeout(() => {
      e.currentTarget.src += ''; // Trigger reload
    }, 5000);
  };

  // Sequential iframe loader with delay
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadedIframes((prev) => prev + 1);
    }, 1000); // 1 second delay between iframe loading 

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [graphState]);

  return (
    <div className={styles.dashboardContainer}>
      <div data-testid='dashboard' className="flex items-end justify-between gap-4">
        <Heading>Dashboard</Heading>
      </div>

      <select id='names' value={graphState} onChange={handleChangeGraph} className={styles.customSelect}>
        <option value='default'>All Graphs</option>
        <option value='Node Charts'>Nodes Charts</option>
        <option value='Cluster Charts'>Cluster Charts</option>
      </select>

      {graphState === 'default' && (
        <>
          <DashboardRow colsSmall={1} colsLarge={2}>
            {loadedIframes >= 1 && (
              <iframe
                src="http://localhost:3000/d-solo/PwMJtdvnz/1-k8s-for-prometheus-dashboard-20211010-en?orgId=1&refresh=5s&panelId=76"
                onError={handleIframeError}
              ></iframe>
            )}
            {loadedIframes >= 2 && (
              <iframe
                src="http://localhost:3000/d-solo/PwMJtdvnz/1-k8s-for-prometheus-dashboard-20211010-en?orgId=1&refresh=5s&panelId=78"
                onError={handleIframeError}
              ></iframe>
            )}
          </DashboardRow>

          <DashboardRow colsSmall={1} colsLarge={1}>
            {loadedIframes >= 3 && (
              <iframe
                src="http://localhost:3000/d-solo/PwMJtdvnz/1-k8s-for-prometheus-dashboard-20211010-en?orgId=1&refresh=5s&panelId=52"
                onError={handleIframeError}
              ></iframe>
            )}
          </DashboardRow>

          <DashboardRow colsSmall={1} colsLarge={3}>
            {loadedIframes >= 4 && (
              <iframe
                src="http://localhost:3000/d-solo/4XuMd2Iiz/kubernetes-cluster-prometheus?orgId=1&refresh=5s&panelId=24"
                onError={handleIframeError}
              ></iframe>
            )}
            {loadedIframes >= 5 && (
              <iframe
                src="http://localhost:3000/d-solo/4XuMd2Iiz/kubernetes-cluster-prometheus?orgId=1&refresh=5s&panelId=18"
                onError={handleIframeError}
              ></iframe>
            )}
            {loadedIframes >= 6 && (
              <iframe
                src="http://localhost:3000/d-solo/4XuMd2Iiz/kubernetes-cluster-prometheus?orgId=1&refresh=5s&panelId=30"
                onError={handleIframeError}
              ></iframe>
            )}
          </DashboardRow>

          <DashboardRow colsSmall={1} colsLarge={2}>
            {loadedIframes >= 7 && (
              <iframe 
                src="http://localhost:3000/d-solo/PwMJtdvnz/1-k8s-for-prometheus-dashboard-20211010-en?orgId=1&refresh=5s&panelId=44"
                onError={handleIframeError}
              ></iframe>
            )}
            {loadedIframes >= 8 && (
              <iframe 
                src="http://localhost:3000/d-solo/PwMJtdvnz/1-k8s-for-prometheus-dashboard-20211010-en?orgId=1&refresh=5s&panelId=75"
                onError={handleIframeError}
              ></iframe>
            )}
          </DashboardRow>
        </>
      )}

      {/* Node Charts, similar pattern as above */}
      {graphState === 'Node Charts' && (
        <>
          <DashboardRow colsSmall={1} colsLarge={2}>
            <iframe 
                src="http://localhost:3000/d-solo/PwMJtdvnz/1-k8s-for-prometheus-dashboard-20211010-en?orgId=1&refresh=5s&panelId=44"
                onError={handleIframeError}
            ></iframe>
            <iframe 
                src="http://localhost:3000/d-solo/PwMJtdvnz/1-k8s-for-prometheus-dashboard-20211010-en?orgId=1&refresh=5s&panelId=45"
                onError={handleIframeError}
            ></iframe>
            <iframe 
                src="http://localhost:3000/d-solo/PwMJtdvnz/1-k8s-for-prometheus-dashboard-20211010-en?orgId=1&refresh=5s&panelId=72"
                onError={handleIframeError}
            ></iframe>
          </DashboardRow>
          <DashboardRow colsSmall={1} colsLarge={2}>
            <iframe 
                src="http://localhost:3000/d-solo/PwMJtdvnz/1-k8s-for-prometheus-dashboard-20211010-en?orgId=1&refresh=5s&panelId=75"
                onError={handleIframeError}
            ></iframe>
          </DashboardRow>
          <DashboardRow colsSmall={1} colsLarge={2}>
            <iframe 
                src="http://localhost:3000/d-solo/PwMJtdvnz/1-k8s-for-prometheus-dashboard-20211010-en?orgId=1&refresh=5s&panelId=76"
                onError={handleIframeError}
            ></iframe>
          </DashboardRow>
          <DashboardRow colsSmall={1} colsLarge={2}>
            <iframe 
                src="http://localhost:3000/d-solo/PwMJtdvnz/1-k8s-for-prometheus-dashboard-20211010-en?orgId=1&refresh=5s&panelId=78"
                onError={handleIframeError}
            ></iframe>
          </DashboardRow>
        </>
      )}
      {graphState === 'Cluster Charts' && (
        <>
          <DashboardRow colsSmall={1} colsLarge={2}>
            <iframe 
                src="http://localhost:3000/d-solo/kube-cluster/1-cluster-summary-nginx-throughput-pod-summary?orgId=1&refresh=5s&panelId=30"
                onError={handleIframeError}
            ></iframe>
            <iframe 
                src="http://localhost:3000/d-solo/kube-cluster/1-cluster-summary-nginx-throughput-pod-summary?orgId=1&refresh=5s&panelId=38"
                onError={handleIframeError}
            ></iframe>
            <iframe 
                src="http://localhost:3000/d-solo/kube-cluster/1-cluster-summary-nginx-throughput-pod-summary?orgId=1&refresh=5s&panelId=18"
                onError={handleIframeError}
            ></iframe>
          </DashboardRow>
          <DashboardRow colsSmall={1} colsLarge={2}>
            <iframe 
                src="http://localhost:3000/d-solo/ff635a025bcfea7bc3dd4f508990a3e9/kubernetes-networking-cluster?orgId=1&refresh=5s&panelId=1"
                onError={handleIframeError}
            ></iframe>
            <iframe 
                src="http://localhost:3000/d-solo/ff635a025bcfea7bc3dd4f508990a3e9/kubernetes-networking-cluster?orgId=1&refresh=5s&panelId=2"
                onError={handleIframeError}
            ></iframe>
          </DashboardRow>
          <DashboardRow colsSmall={1} colsLarge={2}>
            <iframe 
                src="http://localhost:3000/d-solo/ff635a025bcfea7bc3dd4f508990a3e9/kubernetes-networking-cluster?orgId=1&refresh=5s&panelId=8"
                onError={handleIframeError}
            ></iframe>
            <iframe 
                src="http://localhost:3000/d-solo/ff635a025bcfea7bc3dd4f508990a3e9/kubernetes-networking-cluster?orgId=1&refresh=5s&panelId=9"
                onError={handleIframeError}
            ></iframe>
          </DashboardRow>
          <DashboardRow colsSmall={1} colsLarge={2}>
            <iframe 
                src="http://localhost:3000/d-solo/ff635a025bcfea7bc3dd4f508990a3e9/kubernetes-networking-cluster?orgId=1&refresh=5s&panelId=3"
                onError={handleIframeError}
            ></iframe>
          </DashboardRow>
        </>
      )}

      {/* Error message */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
}

export default Dashboard;
