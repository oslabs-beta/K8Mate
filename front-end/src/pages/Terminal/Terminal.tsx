import React, { useState, useEffect, useRef } from 'react';
import { Terminal as XTermTerminal} from '@xterm/xterm';
import { Heading } from '../../components/template/catalyst/heading.tsx';
// import 'xterm/css/xterm.css'
import '@xterm/xterm/css/xterm.css';

const Terminal = (): JSX.Element => {
  const terminalRef = useRef<HTMLDivElement>(null);

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
    term.open(terminalRef.current!);

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
  }, []);

  return (
    <>
    <Heading data-testid='terminal' className={'terminal'} >Terminal</Heading>
    <div ref={terminalRef} style={{ 
      height: 1000, 
      width: '100%', 
      }} />
    </>
  )
}

export default Terminal