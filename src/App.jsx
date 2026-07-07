import React from 'react'
import {HeroUIProvider} from "@heroui/react";
import  {createBrowserRouter,RouterProvider} from 'react-router-dom'
import Layout from './pages/Layout/Layout';
import { path } from 'framer-motion/client';
import Contact from './pages/contact/Contact';
import Home from './pages/Dashboard/Home';
import Addproducts from './pages/addProducts/Addproducts';
import Users from './pages/users/Users';
import Products from './pages/products/Products';
import Carts from './pages/carts/Carts';
import Settings from './pages/settings/Settings';
import Orders from './pages/orders/Orders';

export default function App() {

  const router =createBrowserRouter([
  {path:'/',element:<Layout/>,children:[
    {index:true,element:<Home/>},
    {path:'contact',element:<Contact/>},
    {path:'addproducts',element:<Addproducts/>},
    {path:'users',element:<Users/>},
    {path:'products',element:<Products/>},
    {path:'orders',element:<Orders/>},
    {path:'carts',element:<Carts/>},
    {path:'settings',element:<Settings/>}
  ]}
  ])

  return (
    <HeroUIProvider>
      <RouterProvider router={router}>
      </RouterProvider>
    </HeroUIProvider>
  )
}
