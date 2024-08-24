import React from 'react'
import { useState, useEffect } from 'react'

import { Avatar } from '../../components/template/avatar'
import { Button } from '../../components/template/button'
import { Heading, Subheading } from '../../components/template/heading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/template/table'
import { Select } from '../../components/template/select'




function Alerts() {

  const [ alertList, setAlertList ] = useState([]);
  
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
        }
      } catch(err) {
        console.log(err);
      }
    }
    fetchAlerts();
  }, [])
  
  // useEffect(() => {
  //   //UNREAD
  //   const unreadAlerts = alertList.filter(alert => {
  //     alert.read === 'unread'
  //   })
  //   setUnreadList(unreadAlerts);
    
  //   //READ
  //   const readAlerts = alertList.filter(alert => {
  //     alert.read = 'read'
  //   })
  //   setReadList(readAlerts);
  //   console.log('UNREAD ALERTS', unreadAlerts);
  //   console.log('READ ALERTS', readAlerts);
    
  // }, [alertList])


  const updateAlerts = async (alertId, alertName) => {
    try{
      const response = await fetch('http://localhost:8080/alert/update', {
        method: 'PUT',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: alertId,
          name: alertName
        })
      });
      const data = await response.json();
      console.log('Alert updated: ', data)
    } catch(err){
      console.log(err)
    }
  }

  

  // replace with fetch request
  let alerts = [
    {
      id: 1,
      date: 'Aug 1, 2024',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      status: 'unread',
    },
    {
      id: 2,
      date: 'Aug 3, 2024',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      status: 'unread',
    },
    {
      id: 3,
      date: 'Aug 12, 2024',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      status: 'read',
    },
    {
      id: 4,
      date: 'Aug 16, 2024',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      status: 'unread',
    },
    {
      id: 5,
      date: 'Aug 17, 2024',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      status: 'read',
    },

  ]

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>New Alerts</Heading>
        {/* <Button className="-my-0.5">Create order</Button> */}
      </div>
      
      <Table className="mt-8 mb-12 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Id</TableHeader>
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
            <TableRow key={alert.node_id}>
              <TableCell>{alert.node_id}</TableCell>
              <TableCell className="whitespace-normal max-w-sm max-h-24">{alert.node_name}</TableCell>
              <TableCell className="whitespace-normal max-w-sm max-h-24">{alert.log}</TableCell>
              <TableCell>{alert.category}</TableCell>
              <TableCell>{alert.created_at}</TableCell>
              {/* <TableCell className="text-zinc-500">{alert.date}</TableCell> */}
              <TableCell>
                <Select name="status">
                  <option value="active">{alert.read}</option>
                  <option value="completed">Read</option>
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
      
      <div className="flex items-end justify-between gap-4">
        <Heading>Resolved Alerts</Heading>
        {/* <Button className="-my-0.5">Create order</Button> */}
      </div>

      <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Id</TableHeader>
            <TableHeader>Alert Date</TableHeader>
            <TableHeader>Description</TableHeader>
            <TableHeader>Status</TableHeader>
            {/*<TableHeader className="text-right">Amount</TableHeader> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {alertList.map((alert) => (
            (alert.read === 'read' && 
            <TableRow key={alert.node_id}>
            <TableCell>{alert.node_id}</TableCell>
            <TableCell className="whitespace-normal max-w-sm max-h-24">{alert.node_name}</TableCell>
            <TableCell className="whitespace-normal max-w-sm max-h-24">{alert.log}</TableCell>
            <TableCell>{alert.category}</TableCell>
            <TableCell>{alert.created_at}</TableCell>
            {/* <TableCell className="text-zinc-500">{alert.date}</TableCell> */}
            <TableCell>
              <Select name="status">
                <option value="active">{alert.read}</option>
                <option value="completed">Read</option>
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