import React from 'react';
import styles from './DashboardRow.module.css';

function DashboardRow({ children }) {
  // Calculate the number of columns based on the number of children
  const numChildren = React.Children.count(children);
//   const colsClass = numChildren === 1 ? 'md:grid-cols-1' : numChildren === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';

//   return (
//     <div className={`grid grid-cols-1 ${colsClass} gap-4`}>
//       {children}
//     </div>
//   );

  
  const colsClass = numChildren === 1 ? styles.colOne : numChildren === 2 ? styles.colTwo : styles.colThree;

  return (
    <div className={colsClass}>
      {children}
    </div>
  );
}

export default DashboardRow;
