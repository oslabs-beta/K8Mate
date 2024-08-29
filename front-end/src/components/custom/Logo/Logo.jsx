
import React from 'react';
import logo from '../../../assets/superkuber-logo.png'; // Adjust the path based on your file structure


export const Logo = ({ width = 100, height = 100, ...props }) => (
    <img
        src={logo}
        width={width}
        height={height}
        alt="Logo"
        {...props}
    />
);

// export default Logo;