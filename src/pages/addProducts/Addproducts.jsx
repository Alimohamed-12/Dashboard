import React from 'react'
import { FaRegImage } from "react-icons/fa6";
export default function Addproducts() {
  return (
    <div className='p-5 h-screen'>
       aaaaaaa

     <form >
          <div className='lg:grid grid-cols-12 gap-14'>
           <div className=' col-span-6'>
            <div className=' bg-white shadow rounded-3xl p-5'>
               <div className=' flex items-center gap-4'>
                
                <div className=' bg-[#E6F8FB] p-4 rounded-2xl text-[#22D3EE] '>
                 <FaRegImage size={25}/>
                </div>
                <div>
                    <h3 className=' text-[#0F172A] font-bold text-lg'>Gallery</h3>
                    <p className=' text-[#939EAE] text-sm font-normal'>Upload multiple images and preview instantly.</p>
                </div>
               </div>
               
            </div>
           </div>
           <div className=' col-span-6'>b</div>
       </div>
     </form>
    </div>
  )
}
