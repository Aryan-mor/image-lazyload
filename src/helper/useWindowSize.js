import React, { useEffect, useLayoutEffect, useState } from 'react'
import debounce from './debounce'

export default function useWindowSize(wait = 2000) {

  const [size, setSize] = useState([0, 0])


  useLayoutEffect(() => {
    updateSize()
    try {
      window?.addEventListener('resize', debounce(function() {
        updateSize()
      }, wait))
      return () => window?.removeEventListener('resize', updateSize)
    } catch {}
  }, [])


  function updateSize() {
    try {
      setSize([window?.innerWidth, window?.innerHeight])
    } catch {
    }
  }

  return size
}
