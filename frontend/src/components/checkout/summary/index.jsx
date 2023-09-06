import { Form, Formik } from 'formik'
import styles from './styles.module.scss'
import { useEffect, useMemo, useState } from 'react'
import ShippingInput from '../../inputs/shippingInput'
import { useSaveOrderMutation } from '../../../store/services/orderService'
import { useNavigate } from 'react-router-dom'

export default function Summary({
  user,
  cart,
  paymentMethod,
  selectedAddress,
}) {
  const navigate = useNavigate()
  const [coupon, setCoupon] = useState('')
  // const [order_error, setOrder_error] = useState('');

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
          total: cart.cart_total,
        },
      }
      console.log('Payload in create order->', payload)
      await CreateOrder(payload)
    } catch (error) {
      console.log('Failed to create order: ', error)
    }
  }

  useEffect(() => {
    if (createorder_response.isSuccess) {
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
              <button type="submit">Apply</button>
              <div className={styles.infos}>
                <span>
                  Total : <b>{cart?.cart_total} THB</b>
                </span>
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
