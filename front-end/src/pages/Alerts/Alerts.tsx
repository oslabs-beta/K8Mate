import React, { useState, useEffect, useContext } from 'react';

import { Avatar } from '../../components/template/catalyst/avatar.tsx';
import { Button } from '../../components/template/catalyst/button.tsx';
import { Heading, Subheading } from '../../components/template/catalyst/heading.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/template/catalyst/table.tsx';
import { Select } from '../../components/template/catalyst/select.tsx';

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
        const response = await fetch('http://localhost:8080/alert/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const alerts: AlertData[] = await response.json();
          console.log("READ THIS THIS THIS ", alerts)
          updateAlertsUnreadStatus(alerts.some(alert => alert.read === 'unread'));
          setAlertList(alerts);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchAlerts();
  }, [newReadStatus]);

  // instnat render of alerts
  const updateAlerts = async (alertName: string, id: string, newStatus: "read" | "unread") => {
    const updatedAlerts = alertList.map(alert => {
      if (alert.id === id) {
        return { ...alert, read: newStatus };
      } else {
        return alert;
      }
    });
    setAlertList(updatedAlerts);

    try {
      const response = await fetch('http://localhost:8080/alert/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: alertName,
          db_id: id,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update alert status');
      }

      // Optionally update the status after confirmation
      const data = await response.json();
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

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>, alertName: string, id: string) => {
    const newStatus = event.target.value as "read" | "unread";
    updateAlerts(alertName, id, newStatus);
  };

  const deleteAlert = async (id: string, log: string) => {
    try {
      const response = await fetch('http://localhost:8080/alert/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: id,
          log: log
        })
      });
      if (response.ok) {
        setAlertList(prevList => prevList.filter(alert => alert.id !== id));
      }
    } catch (err) {
      console.log(err);
    }
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
      <div className="my-4">
        <input 
          type="text" 
          placeholder="Search messages..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="p-2 border border-gray-300 rounded"
        />
      </div>
      
      <div className="flex items-end justify-between gap-4">
        <Heading>New Alerts</Heading>
      </div>
  
      <Table className="mt-8 mb-12 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Component Name</TableHeader>
            <TableHeader>Message</TableHeader>
            <TableHeader>Category</TableHeader>
            <TableHeader>Time Stamp</TableHeader>
            <TableHeader>Status</TableHeader>
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
                  <Select
                    name="status"
                    value={alert.read}
                    onChange={(event) => {
                      handleChange(event, alert.node_name, alert.id);
                    }}>
                    <option value="unread">unread</option>
                    <option value="read">read</option>
                  </Select>
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
  
      <div className="flex justify-between items-center my-4">
        <Button 
          onClick={handlePreviousNewAlertsPage} 
          disabled={newAlertsPage === 1} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          prev
        </Button>
        <span className="text-gray-700 text-lg">
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
      <hr className="my-8 border-t-.1 border-gray-300" />
  
      <div className="flex items-end justify-between gap-4">
        <Heading>Resolved Alerts</Heading>
      </div>
  
      <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Component Name</TableHeader>
            <TableHeader>Message</TableHeader>
            <TableHeader>Category</TableHeader>
            <TableHeader>Time Stamp</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader></TableHeader>
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
                  <Select
                    name="status"
                    value={alert.read}
                    onChange={(event) => {
                      handleChange(event, alert.node_name, alert.id);
                    }}>
                    <option value="unread">unread</option>
                    <option value="read">read</option>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button 
                    className="text-red-500" 
                    color="red"
                    onClick={() => deleteAlert(alert.id, alert.log)}
                  >
                    delete
                  </Button>
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
  
      <div className="flex justify-between items-center my-4">
        <Button 
          onClick={handlePreviousResolvedAlertsPage} 
          disabled={resolvedAlertsPage === 1} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          prev
        </Button>
        <span className="text-gray-700 text-lg">
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
