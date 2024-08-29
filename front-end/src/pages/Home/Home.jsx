
import React, { useState } from "react";
import DashboardRow from "../../components/custom/DashboardRow/DashboardRow.jsx";
import { Heading, Subheading } from "../../components/template/catalyst/heading.jsx";
import { Divider } from "../../components/template/catalyst/divider";

import {
  ChartBarIcon,
  BellAlertIcon,
  MapIcon,
} from '@heroicons/react/20/solid'


import styles from "./Dashboard.module.css";

import { Hero } from '../../components/template/pocket/Hero.jsx'
import { SecondaryFeatures } from '../../components/template/pocket/SecondaryFeatures.jsx'


function Home() {
  // State to track if there's any error
  const [errorMessage, setErrorMessage] = useState("");

  // Function to handle iframe load errors
  const handleIframeError = () => {
    setErrorMessage(
      "Some content failed to load. Please check the connection or try again later."
    );
  };

  const chartIcon = <ChartBarIcon className="text-orange-500"/>

  const features = [
    {
      name: 'Reports',
      description:
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
      icon: <ChartBarIcon className="h-12 w-12 text-superPurple animate-float"/>,
      cta:'See Reports',
      link:'/dashboard',
    },
    {
      name: 'Alerts',
      description:
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
      icon: <BellAlertIcon className="h-12 w-12 text-superPurple animate-float"/>,
      cta:'See Alerts',
      link:'/alerts',
    },
    {
      name: 'K8 Structure',
      description:
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
      icon: <MapIcon className="h-12 w-12 text-superPurple animate-float"/>,
      cta:'See Structure',
      link:'/tree',
    },
  ]
  

  return (
    
    <div className={styles.dashboardContainer}>
      <Hero
        className="!pt-20 !pb-0"
        header={``} 
        subheader ={''} 
      />
      <Divider className="my-10" soft />
      <SecondaryFeatures 
        features ={features} 
        header={`Get Started`} 
        subheader ={'Click to explore'} 
        subheaderInclude ={false}
        className="!py-10"
      />
    </div>
  );
}

export default Home;
