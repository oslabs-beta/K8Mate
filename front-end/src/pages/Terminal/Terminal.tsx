import React, { useState, useEffect, useRef } from 'react';
import { Terminal as XTermTerminal} from '@xterm/xterm';
import { FitAddon } from 'xterm-addon-fit';

import { Heading, Subheading } from '../../components/template/catalyst/heading.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/template/catalyst/table.tsx';
import { Text, Code } from "../../components/template/catalyst/text.tsx";
import { Divider } from "../../components/template/catalyst/divider.tsx";


import {
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline'


// import 'xterm/css/xterm.css'
import '@xterm/xterm/css/xterm.css';



const Terminal = (): JSX.Element => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const fitAddon = new FitAddon();

  const commandsList = [
    {
      command: 'kubectl cluster-info',
      description: 'Shows addresses of the control plane and services like API server and DNS'
    },
    {
      command: 'kubectl cluster-info',
      description: 'Shows addresses of the control plane and services like API server and DNS'
    },
    {
      command: 'kubectl cluster-info',
      description: 'More detailed overview of specific deployments'
    },
    {
      command: 'kubectl describe deployment <deployment-name>',
      description: 'Shows addresses of the control plane and services like API server and DNS'
    },
    {
      command: 'kubectl cluster-info',
      description: 'Shows addresses of the control plane and services like API server and DNS'
    },
    {
      command: 'kubectl cluster-info',
      description: 'Shows addresses of the control plane and services like API server and DNS'
    },
    {
      command: 'kubectl cluster-info',
      description: 'Shows addresses of the control plane and services like API server and DNS'
    },
    {
      command: 'kubectl port-forward [TYPE/NAME] [LOCAL_PORT]:[REMOTE_PORT]',
      description: 'Forwards a local port to a port on a resource (ex. kubectl port-forward svc/grafana-node-port-service 3000:80 forwards traffic from localhost:3000 to 80)'
    },
  ]


  useEffect(() => {
    const term = new XTermTerminal({
      theme: {
        background: '#000',
        foreground: '#fff',
        cursor: '#f00',
      },
      fontSize: 14,
      lineHeight: 1.2,
      scrollback: 1000,
    });
    term.loadAddon(fitAddon);

    term.open(terminalRef.current!);
    fitAddon.fit(); // Initially fit the terminal


    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      term.write(event.data);
    };

    term.onData((data) => {
      ws.send(data);
    });

    return () => {
      ws.close();
      term.dispose();
    };
  }, [fitAddon]);

  return (
    <>

      
      <Heading data-testid='terminal' className={'terminal'} >Terminal</Heading>

      {/* <div ref={terminalRef} style={{ 
        height: 1000, 
        width: '100%', 
        }} /> */}
      <div className="w-full h-full my-8 rounded-lg border border-gray-300 lg:ring-1 lg:ring-zinc-950/5">

        <div 
          ref={terminalRef} 
          style={{ 
            height: '100%', 
            width: '100%', }}
        

          />
      </div>

      <div  data-testid='commandLine' className="mb-4">
        <Heading >Command Line Cheat Sheet</Heading>
        <Text >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Text>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Command</TableHeader>
            <TableHeader></TableHeader>
            <TableHeader>What it does</TableHeader>
            
          </TableRow>
        </TableHead>
        <TableBody>
            {commandsList.map((item, ind) => (
              <TableRow key={ind}>
                <TableCell className="whitespace-normal">
                  <Code>{item.command}</Code>
                  </TableCell>
                <TableCell className="text-zinc-500"><DocumentDuplicateIcon className= "w-4 h-4"/></TableCell>
                <TableCell className="whitespace-normal">{item.description}</TableCell>
                
              </TableRow>
            ))}
          
        </TableBody>
    </Table>
    
    </>
    
  )
}

export default Terminal