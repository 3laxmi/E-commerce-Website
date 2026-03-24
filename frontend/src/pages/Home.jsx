// import React, { useEffect, useRef } from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'

const Home = () => {

  // const initRef = useRef(null)

  // useEffect(() => {
  //   initRef.current?.focus()
  // }, [])

  return (
    <div>
      <Hero/>
      <LatestCollection/>

      {/* <div ref={initRef} tabIndex={-1}> */}
        <BestSeller/>
      {/* </div> */}

      <OurPolicy/>
      <NewsletterBox/>
    </div>
  )
}

export default Home