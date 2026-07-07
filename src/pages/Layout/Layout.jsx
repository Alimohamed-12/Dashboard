import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../../component/Navbar'
import Sidebar from '../../component/Sidebar'
import { Navbar } from '@heroui/react'
export default function Layout() {
  return (
    <div>
        {/* <Header/>
        
          <div className=' lg:grid lg:grid-cols-12'>
           
             <div className='lg:col-span-2 '>
                 <Sidebar />
             </div>
             
             <div className='lg:col-span-10 '>
              <Outlet/>
             </div>
          </div> */}

          <div className=' md:grid md:grid-cols-12'>
            <div className='md:col-span-3'>
              <Sidebar/>
            </div>
            <div className='md:col-span-9'>
              <Header/>
              <Outlet/>
            </div>
               
          </div>
    </div>
  )
}
