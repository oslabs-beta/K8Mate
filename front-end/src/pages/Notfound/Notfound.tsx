import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Notfound.module.css'; // Import the CSS module


// Renders page for no route found
const Notfound: React.FC = () => {
  return (
    <div className={styles.notFoundContainer}>
        <h2 data-testid='titleName'>Super Kuber™</h2>
        <h1 data-testid='404' className={styles.notFoundTitle}>404 - Page Not Found</h1>
        <p data-testid='sorry' className={styles.notFoundMessage}>Sorry, the page you are looking for does not exist.</p>
    </div>
  );
}

export default Notfound;
