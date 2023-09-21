import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import authService from './services/authService'
import authReducer from './reducers/authReducer'
import thunk from 'redux-thunk'
import productService from './services/productService'
import cartReducer from './reducers/cartReducer'
import cartService from './services/cartService'
import orderService from './services/orderService'
import expandReducer from './reducers/expandReducer'
import dashboardService from './services/dashboardService'
import dialogReducer from './reducers/dialogReducer'

const reducers = combineReducers({
  [authService.reducerPath]: authService.reducer,
  [productService.reducerPath]: productService.reducer,
  [cartService.reducerPath]: cartService.reducer,
  [orderService.reducerPath]: orderService.reducer,
  [dashboardService.reducerPath]: dashboardService.reducer,
  authReducer: authReducer,
  cartReducer: cartReducer,
  expandReducer: expandReducer,
  dialogReducer: dialogReducer,
})

const config = {
  key: 'root',
  storage,
}

const reducer = persistReducer(config, reducers)

const Store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      authService.middleware,
      productService.middleware,
      cartService.middleware,
      orderService.middleware,
      dashboardService.middleware,
      thunk
    ),
})

export default Store
