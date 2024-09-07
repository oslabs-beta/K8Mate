import React, { ImgHTMLAttributes } from 'react';
import logo from '../../../assets/superkuber-logo.png'; // Adjust the path based on your file structure

// Define the props type
interface LogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  width?: number;
  height?: number;
}

export const Logo: React.FC<LogoProps> = ({ width = 100, height = 100, ...props }) => (
  <img
    src={logo}
    width={width}
    height={height}
    alt="Logo"
    {...props} // Spread the props to allow for customization
  />
);