import React from 'react'

type Props = {
  children: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

const Button = ({ children, onClick }: Props) => (
  <button
    onClick={onClick}
    className="select-none focus:outline-none focus:ring-2 transition ring-1 font-medium px-3 py-1 normal-case rounded-md ring-green-600 dark:ring-green-300 text-green-900 dark:text-green-50 hover:bg-green-100 dark:hover:bg-green-800 focus:ring-green-500 focus:bg-green-200 dark:focus:bg-green-900 whitespace-nowrap"
  >
    {children}
  </button>
)

export default Button
