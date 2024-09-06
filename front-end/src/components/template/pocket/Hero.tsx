// import Image from 'next/image'

import React, { SVGProps, useId } from 'react';
import clsx from 'clsx'
import { Container } from './Container.tsx'

import {
  ChartBarIcon,
} from '@heroicons/react/20/solid'

import { Logo } from '../../custom/Logo/Logo.tsx'

// Define the props type for BackgroundIllustration
interface BackgroundIllustrationProps extends React.HTMLAttributes<HTMLDivElement> {}



function BackgroundIllustration(props: BackgroundIllustrationProps) {
  let id = useId()

  return (
    <div {...props}>
      <svg
        viewBox="0 0 1026 1026"
        fill="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full animate-spin-slow"
      >
        <path
          d="M1025 513c0 282.77-229.23 512-512 512S1 795.77 1 513 230.23 1 513 1s512 229.23 512 512Z"
          stroke="#D4D4D4"
          strokeOpacity="0.7"
        />
        <path
          d="M513 1025C230.23 1025 1 795.77 1 513"
          stroke={`url(#${id}-gradient-1)`}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id={`${id}-gradient-1`}
            x1="1"
            y1="513"
            x2="1"
            y2="1025"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#6001D2" />
            <stop offset="1" stopColor="#6001D2" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <svg
        viewBox="0 0 1026 1026"
        fill="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full animate-spin-reverse-slower"
      >
        <path
          d="M913 513c0 220.914-179.086 400-400 400S113 733.914 113 513s179.086-400 400-400 400 179.086 400 400Z"
          stroke="#D4D4D4"
          strokeOpacity="0.7"
        />
        <path
          d="M913 513c0 220.914-179.086 400-400 400"
          stroke={`url(#${id}-gradient-2)`}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id={`${id}-gradient-2`}
            x1="913"
            y1="513"
            x2="913"
            y2="913"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#6001D2" />
            <stop offset="1" stopColor="#6001D2" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}


// Define the props type for PlayIcon
interface PlayIconProps extends SVGProps<SVGSVGElement> {}


function PlayIcon(props: PlayIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="11.5" stroke="#D4D4D4" />
      <path
        d="M9.5 14.382V9.618a.5.5 0 0 1 .724-.447l4.764 2.382a.5.5 0 0 1 0 .894l-4.764 2.382a.5.5 0 0 1-.724-.447Z"
        fill="#A3A3A3"
        stroke="#A3A3A3"
      />
    </svg>
  )
}

// Define the props type for Hero component
interface HeroProps {
  className?: string;
  header?: string;
  subheader?: string;
}

export function Hero({ className, header, subheader }: HeroProps) {
  return (
    <div className={clsx("overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36", className,"md:min-h-[300px]")}>
      <Container>
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
          <div className="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6">
            <h1 className="text-5xl font-medium tracking-tight text-gray-900 dark:text-gray-100">
              { header ? header : 'Lorem Ipsum' }
            </h1>
            <p className="mt-6 text-2xl text-gray-600 dark:text-gray-400">
            { subheader ? subheader : 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' }
            </p>
           
          </div>
          <div className="relative mt-10 sm:mt-20 lg:col-span-5 lg:row-span-2 lg:mt-0 xl:col-span-6">
            <BackgroundIllustration className="absolute left-1/2 top-4 h-[1026px] w-[1026px] -translate-x-1/3 stroke-gray-300/70 [mask-image:linear-gradient(to_bottom,white_20%,transparent_75%)] sm:top-16 sm:-translate-x-1/2 lg:-top-16 lg:ml-12 xl:-top-14 xl:ml-0" />
            <div className="-mx-4 h-[320px] px-9 [mask-image:linear-gradient(to_bottom,white_60%,transparent)] sm:mx-0 lg:absolute lg:-inset-x-10 lg:-bottom-20 lg:-top-20 lg:h-auto lg:px-0 lg:pt-10 xl:-bottom-32">
             
              <Logo className ="h-64 w-64 mx-auto max-w-[366px] text-superPurple animate-float"/>
             
                

            </div>
          </div>
          
        </div>
      </Container>
    </div>
  )
}
