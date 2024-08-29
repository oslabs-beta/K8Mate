  import React, { useState } from 'react'
  import DashboardRow from '../../components/custom/DashboardRow/DashboardRow.jsx';
  import { Heading } from '../../components/template/catalyst/heading.jsx'

  import styles from './Dashboard.module.css'

  function Dashboard(props) {

    // State to track if there's any error
    const [errorMessage, setErrorMessage] = useState('');

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
        {/* Two graphs side by side on large screens, one on small screens */}
        <DashboardRow colsSmall={1} colsLarge={2}>
          <iframe
            src="http://localhost:3000/d-solo/PwMJtdvnz/1-k8s-for-prometheus-dashboard-20211010-en?orgId=1&refresh=5s&panelId=76"
            onError={handleIframeError}
          ></iframe>
          <iframe
            src="http://localhost:3000/d-solo/PwMJtdvnz/1-k8s-for-prometheus-dashboard-20211010-en?orgId=1&refresh=5s&panelId=75"
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
      </div>
    );
  }

  export default Dashboard