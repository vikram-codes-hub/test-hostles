import React, { useContext } from 'react'
import { HostelsContext } from '../Context/Hostelss'

const Saved = () => {
const { savedHostels } = useContext(HostelsContext)
  return (
    <div>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 gap-y-6'>
        {savedHostels && savedHostels.length > 0 ? (
          savedHostels.map((item, index) => (
            <div>
                 <img className='w-70' src={(item.image) } key={index} alt={item.name} />
            <p>{item.name}</p>
            </div>
           
          ))
        ) : (
          <p>No saved hostels.</p>
        )}
      </div>
    </div>
  )
}

export default Saved
