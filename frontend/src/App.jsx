import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen'
import ProductScreen from './screens/ProductScreen'
import CartScreen from './screens/CartScreen'
import CheckoutScreen from './screens/CheckoutScreen'
import Public from './routes/Public'
import Private from './routes/Private'
import OrderScreen from './screens/OrderScreen'
import Dashboard from './screens/admin/dashboard/DashboardScreen'
import Categories from './screens/admin/dashboard/CategoriesScreen'
import AdminPrivate from './routes/AdminPrivate'

function App() {
  const [country] = useState({
    name: 'Thailand',
    flag: 'https://cdn.ipregistry.co/flags/emojitwo/th.svg',
  })
  return (
    <>
      <BrowserRouter>
        <div>
          <Routes>
            <Route path="/" element={<HomeScreen country={country} />} />
            <Route
              path="/signin"
              element={
                <Public>
                  <LoginScreen country={country} />
                </Public>
              }
            />
            <Route
              path="/product/:slug"
              element={<ProductScreen country={country} />}
            />
            <Route path="/cart" element={<CartScreen />} />
            <Route
              path="/checkout"
              element={
                <Private>
                  <CheckoutScreen />
                </Private>
              }
            />
            <Route
              path="/order/:order_id"
              element={
                <Private>
                  <OrderScreen country={country} />
                </Private>
              }
            />
            <Route path="admin">
              <Route
                path="dashboard"
                element={
                  <AdminPrivate>
                    <Dashboard />
                  </AdminPrivate>
                }
              />
              <Route
                path="dashboard/categories"
                element={
                  <AdminPrivate>
                    <Categories />
                  </AdminPrivate>
                }
              />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
