import React from 'react';
import CancelTicket from '../Booking/components/CancelTicket';
import PaymentTicket from '../Booking/components/PaymentTicket';


const Settings: React.FC = () => {
 
 

  return (
    <>
          <div className="m-auto w-fit mb-2 font-light md:text-3xl text-3xl ">Settings</div>

    <div className='md:grid md:grid-cols-3 md:w-9/12 m-auto mt-1 '>
      <PaymentTicket />
      <CancelTicket/>
    </div>
    </>
  );
};

export default Settings;
