import React from 'react'

// Lazy load all pages
const Home = React.lazy(() => import('../pages/Home'))
const Collection = React.lazy(() => import('../pages/Collection'))
const About = React.lazy(() => import('../pages/About'))
const Contact = React.lazy(() => import('../pages/Contact'))
const Product = React.lazy(() => import('../pages/Product'))
const PlaceOrder = React.lazy(() => import('../pages/PlaceOrder'))
const Orders = React.lazy(() => import('../pages/Orders'))
const Login = React.lazy(() => import('../pages/Login'))
const Cart = React.lazy(() => import('../pages/Cart'))
const ForgotPassword = React.lazy(() => import('../pages/ForgotPassword'))
const ResetPassword = React.lazy(() => import('../pages/ResetPassword'))
const Wishlist = React.lazy(() => import('../pages/Wishlist'))
const OrderTracking = React.lazy(() => import('../components/OrderTracking'))
const UserProfile = React.lazy(() => import('../components/UserProfile'))
const EditProfile = React.lazy(() => import('../components/EditProfile'))

// Lazy load admin pages
const Add = React.lazy(() => import('../pages/adminpages/Add'))
const List = React.lazy(() => import('../pages/adminpages/List'))
const AdminOrders = React.lazy(() => import('../pages/adminpages/Orders'))
const AdminUsers = React.lazy(() => import('../pages/adminpages/Users'))
const AdminChat = React.lazy(() => import('../pages/adminpages/Chat'))
const AdminEditProfile = React.lazy(() => import('../pages/adminpages/EditProfile'))

export const publicRoutes = [
  { path: '/', component: Home },
  { path: '/collection', component: Collection },
  { path: '/about', component: About },
  { path: '/contact', component: Contact },
  { path: '/product/:productId', component: Product },
  { path: '/login', component: Login },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/reset-password', component: ResetPassword },
]

export const protectedUserRoutes = [
  { path: '/cart', component: Cart, withChat: true },
  { path: '/place-order', component: PlaceOrder, withChat: true },
  { path: '/orders', component: Orders, withChat: true },
  { path: '/track-order/:orderId', component: OrderTracking, withChat: true },
  { path: '/profile', component: UserProfile, withChat: true },
  { path: '/edit-profile', component: EditProfile, withChat: true },
  { path: '/wishlist', component: Wishlist, withChat: true },
]

export const adminRoutes = [
  { path: 'add', component: Add },
  { path: 'list', component: List },
  { path: 'orders', component: AdminOrders },
  { path: 'users', component: AdminUsers },
  { path: 'chat', component: AdminChat },
  { path: 'edit-profile', component: AdminEditProfile },
]
