import { useEffect, useMemo, useState } from 'react'
import Header from '../components/cart/header'
import Shipping from '../components/checkout/shipping'
import styles from '../styles/checkout.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import {
  useChangeActiveAddressMutation,
  useDeleteAddressMutation,
  useSaveAddressMutation,
} from '../store/services/authService'
import { setUserSession } from '../store/reducers/authReducer'
import Products from '../components/checkout/products'
import Payment from '../components/checkout/payment'
import Summary from '../components/checkout/summary'
import { useGetCartQuery } from '../store/services/cartService'
import { useNavigate } from 'react-router-dom'

export default function CheckoutScreen() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userSession } = useSelector((state) => state.authReducer)
  const [addresses] = useState(userSession?.user?.addresses || [])
  const [paymentMethod, setPaymentMethod] = useState('')
  const [selectedAddress, setSelectedAddress] = useState('')
  const [totalAfterDiscount, setTotalAfterDiscount] = useState('')

  useEffect(() => {
    let check = addresses.find((ad) => ad.active == true)
    if (check) {
      setSelectedAddress(check)
    } else {
      setSelectedAddress('')
    }
  }, [addresses])

  const { data: cartData, refetch } = useGetCartQuery({
    token: userSession.access_token,
  })

  const cart = useMemo(() => cartData?.data || {}, [cartData])
  const errors = useMemo(() => cartData?.error || false, [cartData])

  useEffect(() => {
    refetch()
  }, [refetch])

  useEffect(() => {
    if (errors === true) {
      navigate('/cart')
    }
  }, [errors, navigate])

  //---------------------------- Save Address Area -------------------------------------

  const [saveAddress, address_response] = useSaveAddressMutation()
  const data = useMemo(
    () => address_response?.data?.data,
    [address_response.data]
  )

  const handleSaveAddress = async (shippingData) => {
    try {
      let payload = {
        token: userSession.access_token,
        address: {
          shipping: shippingData,
        },
      }
      await saveAddress(payload)
    } catch (error) {
      console.log('Failed to save address: ', error)
    }
  }

  useEffect(() => {
    if (address_response.isSuccess) {
      // Update the addresses in the user session and create a new user session object
      const updatedUser = { ...userSession.user, addresses: data }
      const updatedUserSession = { ...userSession, user: updatedUser }

      dispatch(setUserSession(updatedUserSession))
      // Update local storage with the new user session data
      localStorage.setItem('user-session', JSON.stringify(updatedUserSession))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address_response.isSuccess])

  //---------------------------- Change Active Address Area -------------------------------------

  const [ChangeActive, active_response] = useChangeActiveAddressMutation()
  const alladdressdata = useMemo(
    () => active_response?.data?.data,
    [active_response.data]
  )

  const handleChangeActiveAddress = async (id) => {
    try {
      let payload = {
        token: userSession.access_token,
        active_address_id: {
          active_address_id: id,
        },
      }
      await ChangeActive(payload)
    } catch (error) {
      console.log('Failed to change active address: ', error)
    }
  }

  useEffect(() => {
    if (active_response.isSuccess) {
      // Update the addresses in the user session and create a new user session object
      const updatedUser = { ...userSession.user, addresses: alladdressdata }
      const updatedUserSession = { ...userSession, user: updatedUser }

      dispatch(setUserSession(updatedUserSession))
      // Update local storage with the new user session data
      localStorage.setItem('user-session', JSON.stringify(updatedUserSession))
      window.location.reload()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active_response.isSuccess, dispatch])

  //---------------------------- Delete Address Area -------------------------------------

  const [Delete, delete_response] = useDeleteAddressMutation()
  const remainaddressdata = useMemo(
    () => delete_response?.data?.data,
    [delete_response.data]
  )

  const handleDeleteAddress = async (id) => {
    console.log('ID for deleting...', id)
    try {
      let payload = {
        token: userSession.access_token,
        delete_address_id: {
          delete_address_id: id,
        },
      }
      await Delete(payload)
    } catch (error) {
      console.log('Failed to change active address: ', error)
    }
  }

  useEffect(() => {
    if (delete_response.isSuccess) {
      // Update the addresses in the user session and create a new user session object
      const updatedUser = { ...userSession.user, addresses: remainaddressdata }
      const updatedUserSession = { ...userSession, user: updatedUser }

      // Dispatch the action to update the user session in Redux state
      dispatch(setUserSession(updatedUserSession))
      // Update local storage with the new user session data
      localStorage.setItem('user-session', JSON.stringify(updatedUserSession))
      window.location.reload()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delete_response.isSuccess, dispatch])

  return (
    <>
      <>
        <Header />
        <div className={`${styles.container} ${styles.checkout}`}>
          <div className={styles.checkout_side}>
            <Shipping
              user={userSession}
              addresses={userSession.user.addresses}
              setAddresses={handleSaveAddress}
              setActive={handleChangeActiveAddress}
              setDelete={handleDeleteAddress}
            />
            <Products cart={cart} />
          </div>
          <div className={styles.checkout_side}>
            <Payment
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
            <Summary
              totalAfterDiscount={totalAfterDiscount}
              setTotalAfterDiscount={setTotalAfterDiscount}
              user={userSession}
              cart={cart}
              paymentMethod={paymentMethod}
              selectedAddress={selectedAddress}
            />
          </div>
        </div>
      </>
    </>
  )
}
