import React from 'react'
import { HeroUIProvider } from "@heroui/react";
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';
import Layout from './pages/Layout/Layout';
import Contact from './pages/contact/Contact';
import Home from './pages/Dashboard/Home';
import Addproducts from './pages/addProducts/Addproducts';
import Users from './pages/users/Users';
import Carts from './pages/carts/Carts';
import Settings from './pages/settings/Settings';
import Orders from './pages/orders/Orders';
import Products from "./component/Products";
import ProductDetails from "./pages/ProductDetails";

// Wrapper for the Products component to handle actions/navigation
function ProductsPage() {
  const navigate = useNavigate();

  return (
    <Products
      onAddProduct={() => console.log("Add product clicked")}
      onView={(product) => navigate(`/products/${product.id}`)}
      onEdit={(product) => console.log("Edit", product)}
      onQuickEdit={(product) => console.log("Quick edit", product)}
      onDelete={(product) => console.log("Delete", product)}
    />
  );
}

export default function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'contact', element: <Contact /> },
        { path: 'addproducts', element: <Addproducts /> },
        { path: 'users', element: <Users /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'products/:id', element: <ProductDetails /> },
        { path: 'orders', element: <Orders /> },
        { path: 'carts', element: <Carts /> },
        { path: 'settings', element: <Settings /> }
      ]
    }
  ]);

  return (
    <HeroUIProvider>
      <RouterProvider router={router} />
    </HeroUIProvider>
  )
}

