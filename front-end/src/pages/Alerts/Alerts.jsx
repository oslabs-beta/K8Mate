import React from 'react'
import { useState, useEffect } from 'react'

import { Avatar } from '../../components/template/avatar'
import { Button } from '../../components/template/button'
import { Heading, Subheading } from '../../components/template/heading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/template/table'
import { Select } from '../../components/template/select'




function Alerts() {

  const [ alertList, setAlertList ] = useState([]);
  //unread list
  //read list
  //somewhere below, use useEffects to filter our current alertList to separate unread and read, then set unread list to unread filter and read list to read filter
    //in the dependancy arrays, both will be listening for changes made to alertList state
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
        }
      } catch(err) {
        console.log(err);
      }
    }
    fetchAlerts();
  }, [])

  

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
            <TableHeader>Alert Date</TableHeader>
            <TableHeader>Description</TableHeader>
            <TableHeader>Status</TableHeader>
            {/*<TableHeader className="text-right">Amount</TableHeader> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {alertList.map((alert) => (
            (alert.status === 'unread' && 
            <TableRow key={alert.id}>
              <TableCell>{alert.id}</TableCell>
              <TableCell>{alert.name}</TableCell>
              <TableCell>{alert.category}</TableCell>
              {/* <TableCell className="text-zinc-500">{alert.date}</TableCell> */}
              <TableCell className="whitespace-normal max-w-sm max-h-24">{alert.log}</TableCell>
              <TableCell>
                <Select name="status">
                  <option value="active">Unread</option>
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
          {alerts.map((alert) => (
            (alert.status === 'read' && 
            <TableRow key={alert.id}>
              <TableCell>{alert.id}</TableCell>
              <TableCell className="text-zinc-500">{alert.date}</TableCell>
              <TableCell className="whitespace-normal max-w-sm max-h-24">{alert.description}</TableCell>
              <TableCell>
                <Select name="status">
                  <option value="active">Unread</option>
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