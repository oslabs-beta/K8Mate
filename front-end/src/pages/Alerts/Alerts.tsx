import React, { useState, useEffect, useContext } from 'react';

import { Avatar } from '../../components/template/catalyst/avatar.tsx';
import { Button } from '../../components/template/catalyst/button.tsx';
import { Heading, Subheading } from '../../components/template/catalyst/heading.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/template/catalyst/table.tsx';
import { Select } from '../../components/template/catalyst/select.tsx';
import { Checkbox } from '../../components/template/catalyst/checkbox.tsx'
import { Text, TextLink } from '../../components/template/catalyst/text.tsx'

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

import { getAlerts, putAlerts, deleteAlerts } from '../../services/alertsService.ts';
import { convertToMilitaryTime } from '../../hooks/useData.ts';
import { AlertsContext } from './AlertsContext.tsx';
import { SettingsContext } from '../../contexts/SettingsContext.tsx';

type AlertData = {
  id: string,
  node_id: string,
  node_name: string,
  log: string,
  category: string,
  created_at: string,
  read: "read" | "unread"
}

function Alerts() {

  const context = useContext(SettingsContext);
    if (!context) {
      throw new Error('Context not within provider');
    }

    const {
      timezone, 
      // localTimezone, 
      // updateTimezone,
      // isDarkMode,
      // toggleTheme
    } = context

    const alertsContexts = useContext(AlertsContext);
    if (!alertsContexts) {
      throw new Error('Context not within provider')
    }

    const { 
        // alertsUnreadStatus,
        updateAlertsUnreadStatus,
      } = alertsContexts;

    

  const [alertList, setAlertList] = useState<AlertData[]>([]);
  const [newReadStatus, setReadStatus] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  // const { 
  //   alertsUnreadStatus,
  //   updateAlertsUnreadStatus,
  // } = useContext(AlertsContext);



  // pagination states
  const [newAlertsPage, setNewAlertsPage] = useState<number>(1);
  const [resolvedAlertsPage, setResolvedAlertsPage] = useState<number>(1);
  const alertsPerPage = 5; 

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const alerts = await getAlerts();
        updateAlertsUnreadStatus(alerts.some(alert => alert.read === 'unread'));
        setAlertList(alerts);
      } catch (err) { console.log(err); }
    };
    fetchAlerts();
  }, [newReadStatus]);

  // instnat render of alerts
  const updateAlerts = async (alertName: string, id: string, newStatus: "read" | "unread") => {
    const updatedAlerts = alertList.map(alert => {
      if (alert.id === id) { return { ...alert, read: newStatus }; } 
      else { return alert; }
    });

    setAlertList(updatedAlerts);

    try {
      await putAlerts(alertName, id, newStatus);
      setReadStatus([alertName, id, newStatus].toString());
    } catch (err) {
      console.error(err);

      // Revert the optimistic update in case of an error
      const revertedAlerts: AlertData[] = alertList.map(alert =>
        alert.id === id ? { ...alert, read: newStatus === 'unread' ? 'read' : 'unread' } : alert 
      );

      setAlertList(revertedAlerts);
    }
  };

  const handleBoxChange = (checked: boolean, alertName: string, id: string) => {
    setTimeout(() => {
      const newStatus = checked ? "read" : "unread";
      updateAlerts(alertName, id, newStatus);
    }, 300)
  };

  const deleteAlert = async (id: string, log: string) => {
    try {
      await deleteAlerts(id, log);
      setAlertList(prevList => prevList.filter(alert => alert.id !== id));
    } catch (err) { console.log(err); }
  };

  const filteredAlerts = alertList.filter(alert => 
    alert.log.toLowerCase().includes(search.toLowerCase())
  ).reverse();

  // separate alerts based on status
  const newAlerts = filteredAlerts.filter(alert => alert.read === 'unread');
  const resolvedAlerts = filteredAlerts.filter(alert => alert.read === 'read');

  // pagination for new alerts
  const indexOfLastNewAlert = newAlertsPage * alertsPerPage;
  const indexOfFirstNewAlert = indexOfLastNewAlert - alertsPerPage;
  const currentNewAlerts = newAlerts.slice(indexOfFirstNewAlert, indexOfLastNewAlert);
  const totalNewAlertsPages = Math.ceil(newAlerts.length / alertsPerPage);

  // pagination for resolved alerts
  const indexOfLastResolvedAlert = resolvedAlertsPage * alertsPerPage;
  const indexOfFirstResolvedAlert = indexOfLastResolvedAlert - alertsPerPage;
  const currentResolvedAlerts = resolvedAlerts.slice(indexOfFirstResolvedAlert, indexOfLastResolvedAlert);
  const totalResolvedAlertsPages = Math.ceil(resolvedAlerts.length / alertsPerPage);

  const handleNextNewAlertsPage = () => {
    setNewAlertsPage(prevPage => (prevPage < totalNewAlertsPages ? prevPage + 1 : prevPage));
  };

  const handlePreviousNewAlertsPage = () => {
    setNewAlertsPage(prevPage => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const handleNextResolvedAlertsPage = () => {
    setResolvedAlertsPage(prevPage => (prevPage < totalResolvedAlertsPages ? prevPage + 1 : prevPage));
  };

  const handlePreviousResolvedAlertsPage = () => {
    setResolvedAlertsPage(prevPage => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  return (
    <>
      <div className="flex gap-2 mt-4 mb-12">
        <MagnifyingGlassIcon className='w-4  dark:text-gray-300'/>
        <input 
          type="text" 
          placeholder="Search messages..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="p-1 border border-gray-300 rounded text-sm w-72"
        />
      </div>
      
      <div data-testid='alerts' className="flex items-end justify-between gap-4">
        <Heading>New Alerts</Heading>
      </div>
  
      <Table className="mt-2 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Component Name</TableHeader>
            <TableHeader>Message</TableHeader>
            <TableHeader>Category</TableHeader>
            <TableHeader>Time Stamp</TableHeader>
            <TableHeader>Read?</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentNewAlerts.length > 0 ? (
            currentNewAlerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell className="whitespace-normal max-w-sm max-h-24">
                  <div className="flex flex-col">
                    <div>{alert.node_name}</div>
                    <div className="text-xs text-gray-400">ID: {alert.node_id}</div>
                  </div>
                </TableCell>
                <TableCell className="whitespace-normal max-w-sm max-h-24">{alert.log}</TableCell>
                <TableCell>{alert.category}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div>{convertToMilitaryTime(alert.created_at, timezone,'timestamp')}</div>
                    <div className="text-xs text-gray-400">{convertToMilitaryTime(alert.created_at, timezone, 'date')}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Checkbox
                    name="status"
                    checked={alert.read === "read"}
                    onChange={(checked: boolean) => handleBoxChange(checked, alert.node_name, alert.id)}        
                    className="transition-colors duration-300 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"                              
                    />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No unread messages at this time
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
  
      <div className="flex justify-between items-center mt-6">
        <Button 
          onClick={handlePreviousNewAlertsPage} 
          disabled={newAlertsPage === 1} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          prev
        </Button>
        <span className="text-gray-700 text-m dark:text-gray-300">
          Page <strong>{newAlertsPage}</strong> of <strong>{totalNewAlertsPages}</strong>
        </span>
        <Button 
          onClick={handleNextNewAlertsPage} 
          disabled={newAlertsPage === totalNewAlertsPages} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          next
        </Button>
      </div>
  
      {/* Divider Line */}
      <hr className="my-14 border-t-[2px] border-gray-400" />
  
      <div className="flex items-end justify-between gap-4">
        <Heading>Resolved Alerts</Heading>
      </div>
  
      <Table className="mt-2 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Component Name</TableHeader>
            <TableHeader>Message</TableHeader>
            <TableHeader>Category</TableHeader>
            <TableHeader>Time Stamp</TableHeader>
            <TableHeader>Read?</TableHeader>
            {/* <TableHeader></TableHeader> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {currentResolvedAlerts.length > 0 ? (
            currentResolvedAlerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell className="whitespace-normal max-w-sm max-h-24">
                  <div className="flex flex-col">
                    <div>{alert.node_name}</div>
                    <div className="text-xs text-gray-400">ID: {alert.node_id}</div>
                  </div>
                </TableCell>
                <TableCell className="whitespace-normal max-w-sm max-h-24">{alert.log}</TableCell>
                <TableCell>{alert.category}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div>{convertToMilitaryTime(alert.created_at, timezone,'timestamp')}</div>
                    <div className="text-xs text-gray-400">{convertToMilitaryTime(alert.created_at, timezone, 'date')}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Checkbox
                    name="status"
                    checked={alert.read === "read"}
                    onChange={(checked: boolean) => handleBoxChange(checked, alert.node_name, alert.id)}  
                    className="transition-colors duration-300 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"                  
                    />
                  <Text id="deleteButton"   
                    style={{ 
                      color: 'red', 
                      cursor: 'pointer', 
                      textDecoration: 'underline',
                      fontSize: '12px' 
                    }} 
                    onClick={() => deleteAlert(alert.id, alert.log)}
                  > delete
                  </Text> 
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No resolved alerts at this time
              </TableCell>
            </TableRow>
            
          )}
        </TableBody>
      </Table>
  
      <div className="flex justify-between items-center mt-6 mb-6">
        <Button 
          onClick={handlePreviousResolvedAlertsPage} 
          disabled={resolvedAlertsPage === 1} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          prev
        </Button>
        <span className="text-gray-700 text-m dark:text-gray-300">
          Page <strong>{resolvedAlertsPage}</strong> of <strong>{totalResolvedAlertsPages}</strong>
        </span>
        <Button 
          onClick={handleNextResolvedAlertsPage} 
          disabled={resolvedAlertsPage === totalResolvedAlertsPages} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          next
        </Button>
      </div>
    </>
  );
}

export default Alerts;
