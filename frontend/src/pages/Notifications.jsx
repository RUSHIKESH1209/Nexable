import React from 'react'
import Notifications_item from '../components/Notifications_item'
import Home_suggestions from '../components/Home_suggestions'
import Home_profile from '../components/Home_profile'

const Notifications = () => {
  return (
    <>
      <Home_profile></Home_profile>
      <Notifications_item></Notifications_item>
      <Home_suggestions></Home_suggestions>
    </>
  )
}

export default Notifications