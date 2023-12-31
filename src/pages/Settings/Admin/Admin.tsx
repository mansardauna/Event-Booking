import React from 'react'
import { Link } from 'react-router-dom'

function Admin() {
  return (
    <div className='md:w-6/12 m-auto p-2 flex flex-col gap-5 mt-4'>
      <div className="w-fit m-auto md:text-3xl text-xl font-light">
        Welcom to Admin Dashboard
      </div>
      <div className="w-10/12 md:w-10/12 m-auto text-justify">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa non aliquid laborum quo rerum fuga animi accusamus repellendus excepturi dolorem est eveniet doloribus consequuntur, fugit voluptatibus architecto, minus amet dolorum.
      </div>
      <div className="flex justify-between mt-5">
      <div className="">
        <Link to="/register" className='p-2 border border-slate-600 shadow-md'>
        Add new Event hall
        </Link>
      </div>
      <div className="">
        <Link to="/management" className='p-2 border border-slate-600 shadow-md'>
          Manage your Event hall
        </Link>
        </div>
      </div>
    </div>
  )
}

export default Admin