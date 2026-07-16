import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
} from "@heroui/react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const menuItems = [
  { item: "Dashboard", path: "/" },
  { item: "Users", path: "users" },
  { item: "Products", path: "products" },
  { item: "Add Product", path: "addproducts" },
  { item: "Orders", path: "orders" },
  { item: "Carts", path: "carts" },
  { item: "My Settings", path: "settings" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { logout, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="full"
      isBlurred={false}
      className="bg-white border-b border-gray-100 dark:bg-slate-900 dark:border-slate-800"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />

        <NavbarBrand className="flex flex-col items-start gap-0">
          <p className="font-bold text-inherit text-lg dark:text-white">Koda Dashboard</p>
          <p className="text-gray-400 text-xs">E-Commerce Admin Panel</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="relative border rounded-lg shadow-lg w-10 h-10 flex items-center justify-center dark:border-slate-700 dark:bg-slate-800">
          <IoMdNotificationsOutline size={18} className="dark:text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white dark:border-slate-800" />
        </NavbarItem>

        <NavbarItem
          onClick={toggleTheme}
          className="cursor-pointer border rounded-lg shadow-lg w-10 h-10 flex items-center justify-center dark:border-slate-700 dark:bg-slate-800"
        >
          {isDark ? (
            <MdOutlineLightMode size={18} className="text-white" />
          ) : (
            <MdOutlineDarkMode size={18} />
          )}
        </NavbarItem>

        <NavbarItem className="hidden lg:flex shadow-sm items-center border border-2 border-[#F1F5F9] p-1 rounded-lg gap-3 px-3 dark:border-slate-700">
          <div className="rounded-full w-10 h-10 flex justify-center items-center text-white bg-blue-400">
            AA
          </div>
          <div>
            <h2 className="text-[#0f172a] font-bold dark:text-white">
              {user?.name || "Admin account1"}
            </h2>
            <p className="text-sm dark:text-gray-400">{user?.role || "Admin"}</p>
          </div>
        </NavbarItem>

        <NavbarItem>
          <Button
            onClick={handleLogout}
            className="bg-[#DC2626] text-white font-bold rounded-xl"
            variant="flat"
          >
            <LuLogOut />
            <span className="hidden lg:block">Logout</span>
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="dark:bg-slate-900">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.path}-${index}`}>
            <Link
              className="w-full cursor-pointer block my-2 dark:text-white"
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