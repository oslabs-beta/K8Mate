'use client'
import { Avatar } from './template/avatar'
import { useState } from 'react';


import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from './template/dropdown'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from './template/navbar'
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
} from './template/sidebar'
import { SidebarLayout } from './template/sidebar-layout'

import GithubIcon from './custom/GithubIcon/GithubIcon.jsx'

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
} from '@heroicons/react/20/solid'
import { Link, NavLink, useLocation } from 'react-router-dom'  // Import NavLink from react-router-dom

function AccountDropdownMenu({ anchor }) {
  return (
    <DropdownMenu className="min-w-64" anchor={anchor}>
      <DropdownItem href="#">
        <UserCircleIcon />
        <DropdownLabel>My account</DropdownLabel>
      </DropdownItem>
      <DropdownDivider /> {/* Self-closing tag */}
      <DropdownItem href="#">
        <ShieldCheckIcon />
        <DropdownLabel>Privacy policy</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="#">
        <LightBulbIcon />
        <DropdownLabel>Share feedback</DropdownLabel>
      </DropdownItem> {/* Correctly closed DropdownItem */}
      <DropdownDivider /> {/* Self-closing tag */}
      <DropdownItem href="#">
        <ArrowRightStartOnRectangleIcon />
        <DropdownLabel>Sign out</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  )
}


export function ApplicationLayout({ events, children, showSidebar, setShowSidebar }) {

  return (
    <SidebarLayout
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <SidebarItem style={{ pointerEvents: 'none', cursor: 'default' }}>
              <ChartBarIcon/>
              <SidebarLabel>Catalyst™</SidebarLabel>
            </SidebarItem>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              <SidebarItem as={NavLink} to='/dashboard' current={useLocation().pathname === "/dashboard"} 
              onClick={() => setShowSidebar(false)}
              >
                <HomeIcon />
                <SidebarLabel>Dashboard</SidebarLabel>
              </SidebarItem>
              <SidebarItem as={NavLink} to="/alerts" current={useLocation().pathname === "/alerts"} 
              onClick={() => setShowSidebar(false)}
              >
                <BellAlertIcon />
                <SidebarLabel>Alerts</SidebarLabel>
              </SidebarItem>
              <SidebarItem as={NavLink} to="/tree"  current={useLocation().pathname === "/tree"} 
              onClick={() => setShowSidebar(false)}
              >
                <MapIcon />
                <SidebarLabel>K8 Structure</SidebarLabel>
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
