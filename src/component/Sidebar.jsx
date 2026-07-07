import React from 'react'
import { NavLink } from 'react-router-dom'
import { CiHome } from "react-icons/ci";
import { HiUsers } from "react-icons/hi2";
import { FaPlus } from "react-icons/fa6";
import { FaCube } from "react-icons/fa6";
import { FaCartShopping } from "react-icons/fa6";
import { CgNotes } from "react-icons/cg";
import { IoSettings } from "react-icons/io5";
export default function Sidebar() {
  return (

      <ul className=' hidden md:flex flex-col  bg-white shadow-lg gap-2 py-5  text-[#0F172A] font-medium fixed w-[315px]'>
        <div>
        <h4 className=' ps-6 text-[#55DDF2] text-xs font-medium tracking-[6px]'>COMMERCE</h4>
        <h2 className=' ps-6 text-[20px] font-medium '>Admin Panel</h2>
        </div>

       <li className='px-6'> <NavLink className={'flex items-center p-3  w-full'}  to={'/'}><CiHome size={18} className=' me-2'/> Dashboard</NavLink></li>
      <li className=' px-6'> <NavLink className={'flex items-center p-3'} to={`/users`}><HiUsers size={18} className=' me-2' /> Users</NavLink></li>
       <li className=' px-6'>   <NavLink className={'flex items-center p-3'} to={`/products`}><FaCube className=' me-2' />Products</NavLink></li>
       <li className=' px-6'> <NavLink className={' flex items-center p-3'} to={`/addproducts`}><FaPlus className=' me-2' />Add Product</NavLink></li>
     <li className=' px-6'><NavLink className={'flex items-center p-3'} to={`/orders`}><CgNotes className=' me-2' />Orders</NavLink></li>
        <li className='px-6'><NavLink className={'flex items-center p-3'} to={`/carts`}><FaCartShopping className=' me-2' />Carts</NavLink></li>
    <li className=' px-6'> <NavLink className={'flex items-center p-3'} to={`/settings`}><IoSettings className=' me-2' /> Settings</NavLink></li>

    <li>
       <div className=' bg-gradient-to-r from-[#17BAEB] to-[#2583E8] mx-5 p-3 px-4 rounded-3xl  text-white'>
        <h2 className='text-[#BEEDFA] text-xs font-medium'>LlVE</h2>
        <h4 className=' font-medium '>Connected to the E-</h4>
        <h4>commerce API</h4>
       </div>
    </li>
      </ul>
    
  )
}
