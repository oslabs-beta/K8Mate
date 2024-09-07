import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Notfound.module.css'; // Import the CSS module

const Notfound: React.FC = () => {
  return (
    <div className={styles.notFoundContainer}>
        <h2>Super Kuber™</h2>
        <h1 className={styles.notFoundTitle}>404 - Page Not Found</h1>
        <p className={styles.notFoundMessage}>Sorry, the page you are looking for does not exist.</p>
    </div>
  );
}

export default Notfound;
