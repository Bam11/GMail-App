import React, { type RefObject, useEffect } from 'react'

type Event = MouseEvent | TouchEvent

export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: Event) => void
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      const el = ref?.current
      if (!el || el.contains((event?.target as Node) || null)) {
        return
      }

      handler(event) //calls handler only if the click is outside of the elements passed
    }

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);
    }
  }, [ref, handler]) // Reloads only if the ref or handler changes
}


//Based on my research