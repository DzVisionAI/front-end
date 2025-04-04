export const metadata = {
  title: 'Home - Open PRO',
  description: 'Page description',
}

import Hero from '@/app/ui/hero-home'
import Process from '@/app/ui/process'
import FeaturesHome from '@/app/ui/features'
import Tabs from '@/app/ui/tabs'
import Target from '@/app/ui/target'
import News from '@/app/ui/news'
import Newsletter from '@/app/ui/newsletter'

export default function Home() {
  return (
    <>
      <Hero />
      <Process />
      <FeaturesHome />
      <Tabs />
      <Target />
      <News />
      <Newsletter />      
    </>
  )
}
