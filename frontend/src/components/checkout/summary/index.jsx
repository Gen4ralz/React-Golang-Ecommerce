import { Form, Formik } from 'formik'
import styles from './styles.module.scss'
import { useEffect, useMemo, useState } from 'react'
import ShippingInput from '../../inputs/shippingInput'
import {
  useApplyCouponMutation,
  useSaveOrderMutation,
} from '../../../store/services/orderService'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { emptyCart } from '../../../store/reducers/cartReducer'

export default function Summary({
  user,
  cart,
  paymentMethod,
  selectedAddress,
  totalAfterDiscount,
  setTotalAfterDiscount,
}) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState('')
  const [error, setError] = useState('')

  const [ApplyCoupon, apply_response] = useApplyCouponMutation()
  const couponData = useMemo(
    () => apply_response?.data?.data,
    [apply_response?.data?.data]
  )
  const errorMessage = apply_response?.error
    ? apply_response?.error?.data?.error
    : ''
  const applyCouponHandler = async () => {
    const couponUpper = coupon.toUpperCase()
    try {
      let payload = {
        token: user.access_token,
        coupon: {
          coupon: couponUpper,
        },
      }
      await ApplyCoupon(payload)
    } catch (error) {
      console.log('error:', error)
      setError(error)
    }
  }

  useEffect(() => {
    if (apply_response.isSuccess) {
      setTotalAfterDiscount(couponData.total_after_discount)
      setDiscount(couponData.discount)
      setError('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apply_response.isSuccess])

  useEffect(() => {
    if (apply_response.isError) {
      setError(errorMessage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apply_response.isError])

  const [CreateOrder, createorder_response] = useSaveOrderMutation()
  const orderId = useMemo(
    () => createorder_response?.data?.data,
    [createorder_response?.data?.data]
  )

  const placeOrderHandler = async () => {
    try {
      let payload = {
        token: user.access_token,
        order: {
          products: cart.products,
          payment_method: paymentMethod,
          shipping_address: selectedAddress,
          total:
            totalAfterDiscount != '' ? totalAfterDiscount : cart.cart_total,
          total_before_discount: cart.cart_total,
          coupon_applied: coupon.toLowerCase(),
        },
      }
      await CreateOrder(payload)
    } catch (error) {
      return error.response.data.message
    }
  }

  useEffect(() => {
    if (createorder_response.isSuccess) {
      dispatch(emptyCart())
      navigate(`/order/${orderId}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createorder_response.isSuccess])
  return (
    <div className={styles.summary}>
      <div className={styles.header}>
        <h3>Order Summary</h3>
      </div>
      <div className={styles.coupon}>
        <Formik enableReinitialize initialValues={{ coupon }}>
          {() => (
            <Form>
              <ShippingInput
                name="coupon"
                placeholder="*Coupon"
                onChange={(e) => setCoupon(e.target.value)}
                className={styles.input}
              />
              {error && <span className={styles.error}>{error}</span>}
              <button type="button" onClick={() => applyCouponHandler()}>
                Apply
              </button>
              <div className={styles.infos}>
                <span>
                  Total : <b>{cart?.cart_total} THB</b>
                </span>
                {discount > 0 && (
                  <span className={styles.coupon_span}>
                    Coupon applied : <b>-{discount} THB</b>
                  </span>
                )}
                {totalAfterDiscount < cart.cart_total &&
                  totalAfterDiscount != '' && (
                    <span>
                      New Price : <b>{totalAfterDiscount}</b> THB
                    </span>
                  )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <button
        className={styles.submit_btn}
        onClick={() => placeOrderHandler()}
        disabled={paymentMethod == ''}
        style={{
          cursor: paymentMethod === '' ? 'not-allowed' : 'pointer',
          background: paymentMethod === '' ? 'grey' : '',
        }}>
        Place Order
      </button>
    </div>
  )
}
