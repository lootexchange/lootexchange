import { Dialog, Transition, Disclosure } from '@headlessui/react'
import React, { Fragment, useState } from 'react'
import { ChevronUpIcon, XIcon } from '@heroicons/react/solid'

export default function MyModal() {
  let [isOpen, setIsOpen] = useState(true)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="px-4 py-2 text-sm font-medium bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          Complete your listing
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-4 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-trueGray-900 shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 flex items-center mb-3"
                >
                  <p className="mx-auto">Complete your listing</p>
                  <button
                    type="button"
                    className="transition inline-flex justify-center p-2 text-sm font-medium text-trueGray-500 dark:text-trueGray-400 bg-trueGray-100 dark:bg-trueGray-800 border border-transparent rounded-md hover:bg-trueGray-200 dark:hover:bg-trueGray-700 hover:text-trueGray-800 dark:hover:text-trueGray-200 focus:outline-none focus-visible:ring focus-visible:ring-trueGray-500 focus-visible:ring-opacity-75"
                    onClick={closeModal}
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </Dialog.Title>
                <div className="space-y-2">
                  <Step step={1} title="Initialize your wallet">
                    To get set up for selling on Loot Exchange for the first time,
                    you must initialize your wallet, which requires a one-time
                    gas fee.
                  </Step>
                  <Step step={2} title="Approve token">
                    To get set up for auction listings for the first time, you
                    must approve the token for trading, which requires a
                    one-time gas fee.
                  </Step>
                  <Step step={3} title="Confirm 0.01 ETH listing">
                    Accept the signature request in your wallet and wait for
                    your listing to process.
                  </Step>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

type StepProps = {
  step: number
  title: string
  children: React.ReactNode
}

const Step = ({ step, title, children }: StepProps) => (
  <Disclosure>
    {({ open }) => (
      <>
        <Disclosure.Button className="transition flex gap-2 items-center w-full px-3 py-1.5 text-sm font-medium text-left bg-trueGray-100 dark:bg-trueGray-800 rounded-lg hover:bg-trueGray-200 dark:hover:bg-trueGray-700 focus:outline-none focus-visible:ring focus-visible:ring-trueGray-500 focus-visible:ring-opacity-75">
          <p className="rounded-full h-7 w-7 flex items-center justify-center bg-trueGray-200 dark:bg-trueGray-900">
            {step}
          </p>
          <span>{title}</span>
          <ChevronUpIcon
            className={`${
              open ? 'transform rotate-180' : ''
            } w-5 h-5 text-trueGray-500 dark:text-trueGray-400 ml-auto`}
          />
        </Disclosure.Button>
        <Disclosure.Panel className="px-4 py-2 text-sm">
          {children}
        </Disclosure.Panel>
      </>
    )}
  </Disclosure>
)
