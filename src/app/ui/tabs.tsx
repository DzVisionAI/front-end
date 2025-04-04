'use client'

import { useRef, useState, useEffect } from 'react'

import Image from 'next/image'
import { Transition } from '@headlessui/react'
import TabsImage01 from '../../../public/images/tabs-image-01.jpg'
import camera from '../../../public/images/cameras.jpg'
export default function Tabs() {

  const [tab, setTab] = useState<number>(1)

  const tabs = useRef<HTMLDivElement>(null)

  const heightFix = () => {
    if (tabs.current && tabs.current.parentElement) tabs.current.parentElement.style.height = `${tabs.current.clientHeight}px`
  }

  useEffect(() => {
    heightFix()
  }, [])

  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20 border-t border-gray-800">

          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12" data-aos-id-tabs>
            <h2 className="h2 mb-4" data-aos="fade-up" data-aos-anchor="[data-aos-id-tabs]">System Components</h2>
            <p className="text-xl text-gray-400" data-aos="fade-up" data-aos-delay="200" data-aos-anchor="[data-aos-id-tabs]">Our comprehensive surveillance system integrates multiple components for maximum security effectiveness.</p>
          </div>

          {/* Section content */}
          <div className="md:grid md:grid-cols-12 md:gap-6">

            {/* Content */}
            <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-7 lg:col-span-6 md:mt-6" data-aos="fade-right">
              <div className="mb-8 md:mb-0">
                <a
                  className={`flex items-center text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 ${tab !== 1 ? 'bg-gray-800 border-gray-800 hover:bg-gray-700' : 'bg-purple-600 border-transparent'}`}
                  href="#0"
                  onClick={(e) => { e.preventDefault(); setTab(1); }}
                >
                  <div>
                    <div className="font-bold leading-snug tracking-tight mb-1">AI-Powered Video Analytics</div>
                    <div className="text-gray-400">Real-time analysis of video feeds using advanced AI models for threat detection</div>
                  </div>
                </a>
                <a
                  className={`flex items-center text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 ${tab !== 2 ? 'bg-gray-800 border-gray-800 hover:bg-gray-700' : 'bg-purple-600 border-transparent'}`}
                  href="#0"
                  onClick={(e) => { e.preventDefault(); setTab(2); }}
                >
                  <div>
                    <div className="font-bold leading-snug tracking-tight mb-1">Command & Control Center</div>
                    <div className="text-gray-400">Centralized dashboard for monitoring and managing all surveillance operations</div>
                  </div>
                </a>
                <a
                  className={`flex items-center text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 ${tab !== 3 ? 'bg-gray-800 border-gray-800 hover:bg-gray-700' : 'bg-purple-600 border-transparent'}`}
                  href="#0"
                  onClick={(e) => { e.preventDefault(); setTab(3); }}
                >
                  <div>
                    <div className="font-bold leading-snug tracking-tight mb-1">Data Management & Analytics</div>
                    <div className="text-gray-400">Comprehensive logging and analysis of all security events and detections</div>
                  </div>
                </a>
                <a
                  className={`flex items-center text-lg p-5 rounded border transition duration-300 ease-in-out ${tab !== 4 ? 'bg-gray-800 border-gray-800 hover:bg-gray-700' : 'bg-purple-600 border-transparent'}`}
                  href="#0"
                  onClick={(e) => { e.preventDefault(); setTab(4); }}
                >
                  <div>
                    <div className="font-bold leading-snug tracking-tight mb-1">User & Camera Management</div>
                    <div className="text-gray-400">Advanced tools for managing user access and camera configurations</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Tabs items */}
            <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-5 lg:col-span-6 mb-8 mt-6 md:mb-0 md:order-1">
              <div className="transition-all">
                <div className="relative flex flex-col text-center lg:text-right" data-aos="zoom-y-out" ref={tabs}>
                  {/* Item 1 */}
                  <Transition
                    show={tab === 1}
                    className="w-full"
                    enter="transition ease-in-out duration-500 transform order-first"
                    enterFrom="opacity-0 scale-98"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-out duration-300 transform absolute"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-98"
                    beforeEnter={() => heightFix()}
                  >
                    <div className="relative inline-flex flex-col">
                      <Image className="md:max-w-none mx-auto rounded" src={camera} width={500} height={375} alt="Features bg" />
                      <div className="relative inline-flex flex-col text-center md:text-left ml-6">
                        <h4 className="h4 mt-8 mb-4 ">Advanced AI Models</h4>
                        <p className="text-lg text-gray-400">Our system employs multiple AI models for license plate recognition, behavior analysis, face detection, and personnel counting. Each model is optimized for military-grade accuracy and performance.</p>
                      </div>
                    </div>
                  </Transition>
                  {/* Item 2 */}
                  <Transition
                    show={tab === 2}
                    className="w-full"
                    enter="transition ease-in-out duration-500 transform order-first"
                    enterFrom="opacity-0 scale-98"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-out duration-300 transform absolute"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-98"
                    beforeEnter={() => heightFix()}
                  >
                    <div className="relative inline-flex flex-col">
                      <Image className="md:max-w-none mx-auto rounded" src={TabsImage01} width={500} height={375} alt="Command Center" />
                      <div className="relative inline-flex flex-col text-center md:text-left">
                        <h4 className="h4 mb-2">Real-time Monitoring</h4>
                        <p className="text-lg text-gray-400">The command center provides a comprehensive view of all surveillance operations, with real-time alerts, interactive maps, and instant access to camera feeds and AI detection results.</p>
                      </div>
                    </div>
                  </Transition>
                  {/* Item 3 */}
                  <Transition
                    show={tab === 3}
                    className="w-full"
                    enter="transition ease-in-out duration-500 transform order-first"
                    enterFrom="opacity-0 scale-98"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-out duration-300 transform absolute"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-98"
                    beforeEnter={() => heightFix()}
                  >
                    <div className="relative inline-flex flex-col">
                      <Image className="md:max-w-none mx-auto rounded" src={TabsImage01} width={500} height={375} alt="Analytics Dashboard" />
                      <div className="relative inline-flex flex-col text-center md:text-left">
                        <h4 className="h4 mb-2">Comprehensive Analytics</h4>
                        <p className="text-lg text-gray-400">Advanced analytics and reporting tools provide insights into security events, detection patterns, and system performance. All data is securely stored and easily accessible for analysis.</p>
                      </div>
                    </div>
                  </Transition>
                  {/* Item 4 */}
                  <Transition
                    show={tab === 4}
                    className="w-full"
                    enter="transition ease-in-out duration-500 transform order-first"
                    enterFrom="opacity-0 scale-98"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-out duration-300 transform absolute"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-98"
                    beforeEnter={() => heightFix()}
                  >
                    <div className="relative inline-flex flex-col">
                      <Image className="md:max-w-none mx-auto rounded" src={TabsImage01} width={500} height={375} alt="User Management" />
                      <div className="relative inline-flex flex-col text-center md:text-left">
                        <h4 className="h4 mb-2">System Administration</h4>
                        <p className="text-lg text-gray-400">Powerful tools for managing user roles, permissions, and camera configurations. Easily add new cameras, adjust AI detection parameters, and maintain system security.</p>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
