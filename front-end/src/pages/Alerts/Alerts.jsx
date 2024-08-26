import React from 'react'
import { useState, useEffect } from 'react'

import { Avatar } from '../../components/template/avatar'
import { Button } from '../../components/template/button'
import { Heading, Subheading } from '../../components/template/heading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/template/table'
import { Select } from '../../components/template/select'

import { convertToPSTMilitaryTime } from '../../hooks/useData.js'

// import { updateAlert } from '../../../../backend/controllers/alertController'




function Alerts() {

  const [ alertList, setAlertList ] = useState([]);
  const [ newReadStatus, setReadStatus ] = useState('');
  console.log('alertList outside fetch', alertList);
  
  useEffect(() => {
    const fetchAlerts = async () => {
      try{
        const response = await fetch('http://localhost:8080/alert/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (response.ok) {
          const alerts = await response.json()
          setAlertList(alerts);
          console.log('THESE ARE THE ALERTS', alerts)
          console.log('alertList', alertList);
        }
      } catch(err) {
        console.log(err);
      }
    }
    fetchAlerts();
  }, [newReadStatus])
  
  const updateAlerts = async (alertId, alertName, id, newStatus) => {
    console.log('NEW ALERT:', alertId, alertName, id, newStatus);
    try{
      const response = await fetch('http://localhost:8080/alert/update', {
        method: 'PUT',
        headers:{
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
      console.log('Alert updated: ', data)
      setReadStatus([alertId, alertName, id, newStatus]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleChange = (event, alertId, alertName, id) => {
    const newStatus = event.target.value;
    updateAlerts(alertId, alertName, id, newStatus);
  }

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>New Alerts</Heading>
        {/* <Button className="-my-0.5">Create order</Button> */}
      </div>
      
      <Table className="mt-8 mb-12 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            {/* <TableHeader>Id</TableHeader> */}
            <TableHeader>Component Name</TableHeader>
            <TableHeader>Message</TableHeader>
            <TableHeader>Category</TableHeader>
            <TableHeader>Time Stamp</TableHeader>
            <TableHeader>Status</TableHeader>
            
            {/*<TableHeader className="text-right">Amount</TableHeader> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {alertList.map((alert) => (
            (alert.read === 'unread' && 
            <TableRow key={alert.id}>
              <TableCell className="whitespace-normal max-w-sm max-h-24">
                <div className = "flex flex-col">
                  <div>{alert.node_name}</div>
                  <div className = "text-xs text-gray-400">ID: {alert.node_id}</div>
                </div>
              </TableCell>
              <TableCell className="whitespace-normal max-w-sm max-h-24">{alert.log}</TableCell>
              <TableCell>{alert.category}</TableCell>
              <TableCell>
                <div className = "flex flex-col">
                  <div>{convertToPSTMilitaryTime(alert.created_at,'timestamp')}</div>
                  <div className = "text-xs text-gray-400">{convertToPSTMilitaryTime(alert.created_at,'date')}</div>
                </div>
              </TableCell>
              {/* <TableCell className="text-zinc-500">{alert.date}</TableCell> */}
              <TableCell>
                <Select 
                name="status"
                value= {alert.read}
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
          {alertList.map((alert) => (
            (alert.read === 'read' && 
            <TableRow key={alert.id}>
              <TableCell className="whitespace-normal max-w-sm max-h-24">
                <div className = "flex flex-col">
                  <div>{alert.node_name}</div>
                  <div className = "text-xs text-gray-400">ID: {alert.node_id}</div>
                </div>
              </TableCell>
              <TableCell className="whitespace-normal max-w-sm max-h-24">{alert.log}</TableCell>
              <TableCell>{alert.category}</TableCell>
              <TableCell>
                <div className = "flex flex-col">
                  <div>{convertToPSTMilitaryTime(alert.created_at,'timestamp')}</div>
                  <div className = "text-xs text-gray-400">{convertToPSTMilitaryTime(alert.created_at,'date')}</div>
                </div>
              </TableCell>
              {/* <TableCell className="text-zinc-500">{alert.date}</TableCell> */}
            <TableCell>
                <Select 
                name="status"
                value= {alert.read}
                onChange={(event) => {
                  handleChange(event, alert.node_id, alert.node_name, alert.id);
                }}>
                  <option value="unread">unread</option>
                  <option value="read">read</option>
                </Select>
              </TableCell>

            {/* <TableCell>
              <div className="flex items-center gap-2">
                <Avatar src={order.event.thumbUrl} className="size-6" />
                <span>{order.event.name}</span>
              </div>
            </TableCell> */}
            {/* <TableCell className="text-right">US{order.amount.usd}</TableCell> */}
          </TableRow>
          ))
        )}
        </TableBody>
      </Table>
    </>
  )
}

export default Alerts