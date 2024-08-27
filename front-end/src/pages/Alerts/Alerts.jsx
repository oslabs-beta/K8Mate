import React, { useState, useEffect, useContext } from 'react';

import { Avatar } from '../../components/template/avatar';
import { Button } from '../../components/template/button';
import { Heading, Subheading } from '../../components/template/heading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/template/table';
import { Select } from '../../components/template/select';

import { convertToMilitaryTime } from '../../hooks/useData.js';

import { AlertsContext } from './AlertsContext'
import { SettingsContext } from '../../contexts/SettingsContext'


function Alerts() {

  const {timezone} = useContext(SettingsContext)

  const [alertList, setAlertList] = useState([]);
  const [newReadStatus, setReadStatus] = useState('');
  // filter search state
  const [search, setSearch] = useState('');

  const { 
    alertsUnreadStatus,
    updateAlertsUnreadStatus,
  } = useContext(AlertsContext);

  
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
          const alerts = await response.json();
          updateAlertsUnreadStatus(alerts.some(alert => alert.read ==='unread'))
          setAlertList(alerts);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchAlerts();
  }, [newReadStatus]);

  const updateAlerts = async (alertId, alertName, id, newStatus) => {
    try {
      const response = await fetch('http://localhost:8080/alert/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: alertId,
          name: alertName,
          db_id: id,
          status: newStatus,
        }),
      });
      const data = await response.json();
      setReadStatus([alertId, alertName, id, newStatus]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (event, alertId, alertName, id) => {
    const newStatus = event.target.value;
    updateAlerts(alertId, alertName, id, newStatus);
  };

  // filter based on search terms
  const filteredAlerts = alertList.filter(alert => 
    alert.log.toLowerCase().includes(search.toLowerCase()) 
  );

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
        {/* <Button className="-my-0.5">Create order</Button> */}
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
          {filteredAlerts.some(alert => alert.read === 'unread') ? (

            filteredAlerts.map((alert) => (
              (alert.read === 'unread' &&
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
                        handleChange(event, alert.node_id, alert.node_name, alert.id);
                      }}>
                      <option value="unread">unread</option>
                      <option value="read">read</option>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )
          ):(
            <p>No unread messages at this time</p>
          )}
        </TableBody>
      </Table>

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
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredAlerts.map((alert) => (
            (alert.read === 'read' &&
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
                      handleChange(event, alert.node_id, alert.node_name, alert.id);
                    }}>
                    <option value="unread">unread</option>
                    <option value="read">read</option>
                  </Select>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}

export default Alerts;
