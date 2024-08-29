import * as Headless from '@headlessui/react'
import { Link as RouterLink } from 'react-router-dom'
import { forwardRef } from 'react'

export const Link = forwardRef(function Link(props, ref) {
  return (
    <Headless.DataInteractive>
      <RouterLink {...props} ref={ref} />
    </Headless.DataInteractive>
  )
})
