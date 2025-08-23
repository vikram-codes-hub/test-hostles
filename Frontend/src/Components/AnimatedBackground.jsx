// AnimatedBackground.jsx
import React from 'react'

const AnimatedBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute top-10 left-10 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-2xl animate-pulse"></div>
    {/* Other floating elements */}
  </div>
)

export default AnimatedBackground