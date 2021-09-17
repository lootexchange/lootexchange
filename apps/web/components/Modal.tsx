import React, { useEffect } from 'react'

type Props = {
  onClose: () => void
}

const ModalBackground = ({ onClose }: Props) => {
  // TODO: solve deprecation issue
  function closeOnEscapeKeyDown(e: KeyboardEvent) {
    if ((e.charCode || e.keyCode) === 27) {
      onClose()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', closeOnEscapeKeyDown)
    return () => {
      window.removeEventListener('keydown', closeOnEscapeKeyDown)
    }
  }, [])

  return (
    <button
      // Makes this unable to focus using tab
      tabIndex={-1}
      onClick={() => onClose()}
      // This button covers the entire screen.
      // It closes modal when clicked anywhere but the menu
      className="fixed w-full h-full inset-0 cursor-default focus:outline-none"
    ></button>
  )
}

export default ModalBackground
