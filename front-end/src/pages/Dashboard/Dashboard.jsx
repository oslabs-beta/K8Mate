  import React from 'react'
  import DashboardRow from '../../components/custom/DashboardRow/DashboardRow.jsx';

  import styles from './Dashboard.module.css'

  function Dashboard(props) {
    console.log('dash', props)

    return (
      <div className={styles.dashboardContainer}>
        {console.log('rendered')}

        {/* Two graphs side by side on large screens, one on small screens */}
        <DashboardRow colsSmall={1} colsLarge={2}>
          <iframe src="http://localhost:3000/d-solo/PwMJtdvnz/1-k8s-for-prometheus-dashboard-20211010-en?orgId=1&refresh=5s&panelId=76"></iframe>
          <iframe src="http://localhost:3000/d-solo/PwMJtdvnz/1-k8s-for-prometheus-dashboard-20211010-en?orgId=1&refresh=5s&panelId=75"></iframe>
        </DashboardRow>
        
        {/* One graph across the entire width */}
        <DashboardRow colsSmall={1} colsLarge={1}>
          <iframe src="http://localhost:3000/d-solo/PwMJtdvnz/1-k8s-for-prometheus-dashboard-20211010-en?orgId=1&refresh=5s&panelId=52"></iframe>
        </DashboardRow>
        
        {/* Three graphs side by side on large screens, one on small screens */}
        <DashboardRow colsSmall={1} colsLarge={3}>
          <iframe src="http://localhost:3000/d-solo/4XuMd2Iiz/kubernetes-cluster-prometheus?orgId=1&refresh=5s&panelId=24"></iframe>
          <iframe src="http://localhost:3000/d-solo/4XuMd2Iiz/kubernetes-cluster-prometheus?orgId=1&refresh=5s&panelId=18"></iframe>
          <iframe src="http://localhost:3000/d-solo/4XuMd2Iiz/kubernetes-cluster-prometheus?orgId=1&refresh=5s&panelId=30"></iframe>
        </DashboardRow>
      </div>
    );
  }

  export default Dashboard