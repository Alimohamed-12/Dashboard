import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  // Link,
  Button,
} from "@heroui/react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdOutlineDarkMode } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";
// import { path } from "framer-motion/client";
import { Link } from "react-router-dom";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // const menuItems = [
  //   "Dashboard",
  //   "Users",
  //   "Products",
  //   "Add Product",
  //   "Orders",
  //   "Carts",
  //   "My Settings",
  //   "Team Settings",
  //   "Help & Feedback",
  //   "Log Out",
  // ];

    let menuItems=[
      {item:'Dashboard',path:'/'},
      {item:'Users',path:'users'},
      {item:'Products',path:'products'},
      {item:'Add Product',path:'addproducts'},
      {item:'Orders',path:'orders'},
      {item:'Carts',path:'carts'},
      {item:'My Settings',path:'settings'}
    ]
  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} >

      <NavbarContent  >
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand className=" flex flex-col">
          <p className="font-bold text-inherit text-lg">Koda Dashboard</p>
          <p className=" text-gray-400 text-xs">E-Commerce Admin Panel</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
             <NavbarItem className=" border rounded-lg shadow-lg  p-2 ">
             <IoMdNotificationsOutline />
          </NavbarItem>

          <NavbarItem className=" border rounded-lg shadow-lg  p-2 ">
            <MdOutlineDarkMode/>
          </NavbarItem>

             <NavbarItem className="hidden lg:flex shadow-sm items-center border border-2 border-[#F1F5F9] p-1 rounded-lg  gap-3 px-3 ">
                <div className=" rounded-full  w-10 h-10 flex justify-center items-center text-white  bg-blue-400">AA</div>
                <div>
                    <h2 className=" text-[#0f172a] font-bold">Admin Account</h2>
                    <p className=" text-sm">Admin</p>
                </div>
           </NavbarItem>

        <NavbarItem>
          <Button as={Link} className=" bg-[#DC2626] text-white font-bold rounded-xl" href="#" variant="flat">
        <LuLogOut />  <span className=" hidden lg:block">Logout</span>
          </Button>
        </NavbarItem>
      </NavbarContent>


      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full cursor-pointer block my-2"
              to={`${item.path}`}
            
            >
              {item.item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}


