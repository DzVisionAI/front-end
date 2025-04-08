'use client'

import VideoThumb from '@/public/images/hero-image.png'
import ModalVideo from '@/app/ui/modal-video'
// import video from '@/public/videos/hero.mp4'
export default function HeroHome() {
  return (
    <section className="relative">

      {/* Illustration behind hero content */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none -z-1" aria-hidden="true">
        <svg width="1360" height="578" viewBox="0 0 1360 578" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="illustration-01">
              <stop stopColor="#4B4ACF" offset="0%" />
              <stop stopColor="#5D5DFF" offset="77.402%" />
              <stop stopColor="#8D8DFF" offset="100%" />
            </linearGradient>
          </defs>
          <g fill="url(#illustration-01)" fillRule="evenodd">
            <circle cx="1232" cy="128" r="128" />
            <circle cx="155" cy="443" r="64" />
          </g>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Hero content */}
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">

          {/* Section header */}
          <div className="text-center pb-12 md:pb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4 text-slate-800 dark:text-slate-100" data-aos="zoom-y-out">
              DzVisionAI - Advanced Military <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-400">Surveillance System</span>
            </h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8" data-aos="zoom-y-out" data-aos-delay="150">
                Empowering military operations with cutting-edge AI surveillance technology for enhanced security and threat detection.
              </p>
              <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center" data-aos="zoom-y-out" data-aos-delay="300">
                <div>
                  <a className="btn text-white bg-indigo-500 hover:bg-indigo-600 w-full mb-4 sm:w-auto sm:mb-0" href="#0">
                    Learn More
                  </a>
                </div>
                <div>
                  <a className="btn text-slate-800 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 w-full sm:w-auto sm:ml-4" href="#0">
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Hero image */}
          <ModalVideo
            thumb={VideoThumb}
            thumbWidth={768}
            thumbHeight={432}
            thumbAlt="Modal video thumbnail"
            video="/videos/video.mp4"
            videoWidth={1920}
            videoHeight={1080}
          />

        </div>

      </div>
    </section>
  )
}
