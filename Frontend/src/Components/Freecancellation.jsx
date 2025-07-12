import React from "react";
import { IoCheckbox } from "react-icons/io5";

const Freecancellation = () => {
  return (
   <div className=" flex  ">
     <div className=" flex items-center gap-2 mx-auto mt-10">
      <div>
        <IoCheckbox />
      </div>
      <div><b>Free Cancellation</b> & <b>Flexible Booking</b> available</div>
    </div>
   </div>
  );
};

export default Freecancellation;
