import React, { ImgHTMLAttributes } from 'react';
import logo from '../../../assets/k8-mate-logo.png'; // Adjust the path based on your file structure

// Define the props type
interface LogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  width?: number;
  height?: number;
  logo?: string,
}

export const Logo: React.FC<LogoProps> = ({ width = 100, height = 146, ...props }) => (
  <img
    src={logo}
    width={width}
    height={height}
    alt="Logo"
    {...props} // Spread the props to allow for customization
  />
);