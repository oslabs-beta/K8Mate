import React, { ReactNode } from 'react';
import styles from './DashboardRow.module.css';

// Define the props type
interface DashboardRowProps {
  children?: ReactNode;
  colsSmall?: number;  // Optional prop for small screen columns
  colsLarge?: number;  // Optional prop for large screen columns
}

function DashboardRow({ children }: DashboardRowProps) {
  // Calculate the number of columns based on the number of children

  console.log('dashboard row tsx')
  const numChildren = React.Children.count(children);
  const colsClass = numChildren === 1 ? styles.colOne : numChildren === 2 ? styles.colTwo : styles.colThree;

  return (
    <div className={colsClass}>
      {children}
    </div>
  );
}

export default DashboardRow;
