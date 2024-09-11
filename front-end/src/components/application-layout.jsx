'use client'
import { Avatar } from './template/catalyst/avatar.tsx'
import { useState, useContext } from 'react';


import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from './template/catalyst/dropdown.tsx'

import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from './template/catalyst/navbar.tsx'

import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from './template/catalyst/sidebar.tsx'

import { SidebarLayout } from './template/catalyst/sidebar-layout.tsx'

import GithubIcon from './custom/GithubIcon/GithubIcon.tsx'

import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/16/solid'
import {
  Cog6ToothIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  Square2StackIcon,
  TicketIcon,
  ChartBarIcon,
  GlobeAltIcon,
  BellAlertIcon,
  MapIcon,
  CommandLineIcon
} from '@heroicons/react/20/solid'
import { Link, NavLink, useLocation } from 'react-router-dom'  // Import NavLink from react-router-dom

import { AlertsContext } from '../pages/Alerts/AlertsContext'
import { Logo } from './custom/Logo/Logo.tsx'



export function ApplicationLayout({ children, showSidebar, setShowSidebar }) {

  const { alertsUnreadStatus } = useContext(AlertsContext);

  console.log('alertsUnreadStatus', alertsUnreadStatus)

  return (
    <SidebarLayout
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <SidebarItem style={{ pointerEvents: 'none', cursor: 'default' }}>
            <Logo className ="w-6 "/>
              <SidebarLabel>K8 Mate™</SidebarLabel>
            </SidebarItem>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>

              <SidebarItem as={NavLink} to='/' current={useLocation().pathname === "/"} 
                onClick={() => setShowSidebar(false)}
                >
                  <HomeIcon />
                  <SidebarLabel>Overview</SidebarLabel>
              </SidebarItem>

              <SidebarItem as={NavLink} to='/dashboard' current={useLocation().pathname === "/dashboard"} 
              onClick={() => setShowSidebar(false)}
              >
                <ChartBarIcon/>
                <SidebarLabel>Reports</SidebarLabel>
              </SidebarItem>

              <SidebarItem as={NavLink} to="/alerts" current={useLocation().pathname === "/alerts"} 
              onClick={() => setShowSidebar(false)}
              >
                
                <BellAlertIcon/>
              
                {alertsUnreadStatus ?
                  <SidebarLabel className = 'flex w-full justify-between items-center text-red-500 font-semibold'>
                    Alerts
                    <span className="flex items-center h-2 w-2 bg-red-500 rounded-full" />
                  </SidebarLabel> 
                  : 
                  <SidebarLabel>
                    Alerts
                
                  </SidebarLabel> 
                }
                
              </SidebarItem>

              <SidebarItem as={NavLink} to="/tree"  current={useLocation().pathname === "/tree"} 
              onClick={() => setShowSidebar(false)}
              >
                <MapIcon />
                <SidebarLabel>K8s Structure</SidebarLabel>
              </SidebarItem>

              {/* TO BE REMOVED */}
              {/* <SidebarItem as={NavLink} to="/flow"  current={useLocation().pathname === "/tree"} 
              onClick={() => setShowSidebar(false)}
              >
                <MapIcon />
                <SidebarLabel>ReactFlowTest</SidebarLabel>
              </SidebarItem> */}
              <SidebarItem as={NavLink} to="/terminal"  current={useLocation().pathname === "/terminal"} 
              onClick={() => setShowSidebar(false)}
              >
                <CommandLineIcon />
                <SidebarLabel>Terminal</SidebarLabel>
              </SidebarItem>

              <SidebarItem as={NavLink} to="/settings"  current={useLocation().pathname === "/settings"} 
              onClick={() => setShowSidebar(false)}
              >
                <Cog6ToothIcon />
                <SidebarLabel>Settings</SidebarLabel>
              </SidebarItem>




            </SidebarSection>
          
            <SidebarSpacer />

            <SidebarSection>
              
              <SidebarItem as="div" onClick={() => window.open('https://github.com/oslabs-beta/super-kuber', '_blank', 'noopener noreferrer')}>
                <GithubIcon />
                <SidebarLabel>Github</SidebarLabel>
              </SidebarItem>
              
              <SidebarItem as="div" onClick={() => window.open('https://github.com/oslabs-beta/super-kuber', '_blank', 'noopener noreferrer')}>
                <GlobeAltIcon />
                <SidebarLabel>Website</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  )
}
