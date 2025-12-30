"use client"
import React from 'react'
// import AdBooking from '@/components/AdBooking'
import Hero from '@/components/hero'

import HowItWorks from '@/components/HowItWorks'
import AdSchedule from '@/components/AdSchedule'
import AboutDisplayVehicle from '@/components/AboutAdVehicle'
import ClientTestimonial from '@/components/ClientTestimonial'
import PreviousClient from '@/components/PreviousClients'
import Footer from '@/components/Footer'


const page = () => {
  return (
    <div >
      <Hero/> 
      {/* <AdBooking/> */}
      <HowItWorks/>
      <AdSchedule/>
      <AboutDisplayVehicle/>
      <PreviousClient/>
      <ClientTestimonial/>
      <Footer/>
    </div>
  )
}

export default page
