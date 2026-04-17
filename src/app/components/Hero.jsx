'use client'
import React, { useState } from 'react'

const Hero = () => {
  const [color, setColor] = useState(false)
  
  // This picks the class based on the state
  const changeColor = color ? 'bg-red-500' : 'bg-green-500'

  return (
    <div>
      <button 
        onClick={() => setColor(!color)} // Toggles between true and false
        className={`text-center p-4 rounded-full m-10 ${changeColor}`} // Injects the variable
      > 
        click me 
      </button>
    </div>
  )
}

export default Hero
