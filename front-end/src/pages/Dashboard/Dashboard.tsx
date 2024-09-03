import React, { useState } from 'react';
import DashboardRow from '../../components/custom/DashboardRow/DashboardRow.jsx';
import { Heading } from '../../components/template/catalyst/heading.jsx';
import styles from './Dashboard.module.css';

function Dashboard(props) {

  // State for drop down for different iframes
  const [graphState, setGraphState] = useState<string>('default');

  const handleChangeGraph = (e) => {
    setGraphState(e.target.value);
  };

  // State to track if there's any error
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Function to handle iframe load errors
  const handleIframeError = () => {
    setErrorMessage('Some content failed to load. Please check the connection or try again later.');
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className="flex items-end justify-between gap-4">
        <Heading>Dashboard</Heading>
        {/* <Button className="-my-0.5">Create order</Button> */}
      </div>
      
      <select value={graphState} onChange={handleChangeGraph}>
        <option value='default'>All Graphs</option>
        <option value='Node Charts'>Nodes Charts</option>
        <option value='Cluster Charts'>Cluster Charts</option>
      </select>
      
      {/* Conditionally render the original dashboard rows under the "default" option */}
      {graphState === 'default' && (
        <>
          {/* Two graphs side by side on large screens, one on small screens */}
          <DashboardRow colsSmall={1} colsLarge={2}>
            <iframe
              src="http://localhost:3000/d-solo/PwMJtdvnz/1-k8s-for-prometheus-dashboard-20211010-en?orgId=1&refresh=5s&panelId=76"
              onError={handleIframeError}
            ></iframe>
            <iframe
              src="http://localhost:3000/d-solo/PwMJtdvnz/1-k8s-for-prometheus-dashboard-20211010-en?orgId=1&refresh=5s&panelId=78"
              onError={handleIframeError}
            ></iframe>
          </DashboardRow>

          {/* One graph across the entire width */}
          <DashboardRow colsSmall={1} colsLarge={1}>
            <iframe
              src="http://localhost:3000/d-solo/PwMJtdvnz/1-k8s-for-prometheus-dashboard-20211010-en?orgId=1&refresh=5s&panelId=52"
              onError={handleIframeError}
            ></iframe>
          </DashboardRow>

          {/* Three graphs side by side on large screens, one on small screens */}
          <DashboardRow colsSmall={1} colsLarge={3}>
            <iframe
              src="http://localhost:3000/d-solo/4XuMd2Iiz/kubernetes-cluster-prometheus?orgId=1&refresh=5s&panelId=24"
              onError={handleIframeError}
            ></iframe>
            <iframe
              src="http://localhost:3000/d-solo/4XuMd2Iiz/kubernetes-cluster-prometheus?orgId=1&refresh=5s&panelId=18"
              onError={handleIframeError}
            ></iframe>
            <iframe
              src="http://localhost:3000/d-solo/4XuMd2Iiz/kubernetes-cluster-prometheus?orgId=1&refresh=5s&panelId=30"
              onError={handleIframeError}
            ></iframe>
          </DashboardRow>

          {/* Two graphs side by side */}
          <DashboardRow colsSmall={1} colsLarge={2}>
            <iframe 
              src="http://localhost:3000/d-solo/PwMJtdvnz/1-k8s-for-prometheus-dashboard-20211010-en?orgId=1&refresh=5s&panelId=44"
              onError={handleIframeError}
            ></iframe>
            <iframe 
              src="http://localhost:3000/d-solo/PwMJtdvnz/1-k8s-for-prometheus-dashboard-20211010-en?orgId=1&refresh=5s&panelId=75"
              onError={handleIframeError}
            ></iframe>
          </DashboardRow>
        </>
      )}

      {graphState === 'Node Charts' && (
        <DashboardRow colsSmall={1} colsLarge={2}>
          {/* Add your Node Charts iframes here */}
        </DashboardRow>
      )}

      {graphState === 'Cluster Charts' && (
        <DashboardRow colsSmall={1} colsLarge={2}>
          {/* Add your Cluster Charts iframes here */}
        </DashboardRow>
      )}
      
      {/* Optional: Display an error message if any iframe fails to load */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
}

export default Dashboard;
