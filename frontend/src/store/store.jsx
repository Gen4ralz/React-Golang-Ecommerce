import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import authService from './services/authService'
import authReducer from './reducers/authReducer'
import thunk from 'redux-thunk'
import productService from './services/productService'
import globalReducer from './reducers/globalReducer'
import cartReducer from './reducers/cartReducer'
import cartService from './services/cartService'
import orderService from './services/orderService'
import expandReducer from './reducers/expandReducer'

const reducers = combineReducers({
  [authService.reducerPath]: authService.reducer,
  [productService.reducerPath]: productService.reducer,
  [cartService.reducerPath]: cartService.reducer,
  [orderService.reducerPath]: orderService.reducer,
  authReducer: authReducer,
  globalReducer: globalReducer,
  cartReducer: cartReducer,
  expandReducer: expandReducer,
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
      thunk
    ),
})

export default Store
