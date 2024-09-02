import { RequestHandler } from 'express';

export type alert = {
    createAlert: RequestHandler,
    getAlert: RequestHandler, 
    updateAlert: RequestHandler,
    deleteAlert: RequestHandler
  };
  
  export type Player = "X" | "O";
  
  export type BoardText = "X" | "O" | "-";
  
  export type BoardContent = BoardText[][];
  
  export type BoxProps = {
    handleBoxClick: (index: number) => void,
    character: string,
    boxKey: number
  };
  
  export type RowProps = {
    handleBoxClick: (index: number) => void,
    rowChar: string[],
    rowKey: number}
  
  