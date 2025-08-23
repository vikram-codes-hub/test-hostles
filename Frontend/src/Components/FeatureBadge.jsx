
import React from 'react'

const FeatureBadge = ({ icon, text }) => (
  <div className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
    <div className="w-5 h-5">{icon}</div>
    <span>{text}</span>
  </div>
)

export default FeatureBadge