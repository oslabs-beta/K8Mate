declare module "*.module.css";
declare module "*.module.scss";


// CSS and SCSS Modules
declare module "*.module.css";
declare module "*.module.scss";

// Image Modules
declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default value;
}

declare module '*.gif' {
  const value: string;
  export default value;
}
