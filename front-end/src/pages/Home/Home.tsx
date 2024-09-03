
import React, { useState } from "react";
import DashboardRow from "../../components/custom/DashboardRow/DashboardRow.jsx";
import { Heading, Subheading } from "../../components/template/catalyst/heading.jsx";
import { Divider } from "../../components/template/catalyst/divider.jsx";

import {
  ChartBarIcon,
  BellAlertIcon,
  MapIcon,
} from '@heroicons/react/20/solid'

type Features = {
  name: string,
  description: string,
  icon: JSX.Element,
  cta: string,
  link: string
}[]

import styles from "./Overview.module.css";

import { Hero } from '../../components/template/pocket/Hero.jsx'
import { SecondaryFeatures } from '../../components/template/pocket/SecondaryFeatures.jsx'


function Home() {
  // State to track if there's any error
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Function to handle iframe load errors
  const handleIframeError: () => void = () => {
    setErrorMessage(
      "Some content failed to load. Please check the connection or try again later."
    );
  };

  const chartIcon = <ChartBarIcon className="text-orange-500"/>

  const features: Features = [
    {
      name: 'Reports',
      description:
        'Monitor critical real-time metrics for the health of your app',
      icon: <ChartBarIcon className="h-12 w-12 text-superPurple animate-float dark:text-gray-100"/>,
      cta:'See Reports',
      link:'/dashboard',
    },
    {
      name: 'Alerts',
      description:
        'Stay up-to-date on critical real-time changes to your cluster, nodes, and pods',
      icon: <BellAlertIcon className="h-12 w-12 text-superPurple animate-float dark:text-gray-100"/>,
      cta:'See Alerts',
      link:'/alerts',
    },
    {
      name: 'K8 Structure',
      description:
        'See the birds eye view of your cluster structure',
      icon: <MapIcon className="h-12 w-12 text-superPurple animate-float dark:text-gray-100"/>,
      cta:'See Structure',
      link:'/tree',
    },
  ]
  

  return (
    
    <div className={styles.overviewContainer}>
      <Hero
        className="!pt-20 !pb-0"
        header={`Super Kuber™`} 
        subheader ={'Supercharge Your Kubernetes'} 
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
