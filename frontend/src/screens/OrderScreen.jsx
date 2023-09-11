import { useEffect, useMemo, useReducer, useState } from 'react'
import Header from '../components/header'
import styles from '../styles/order.module.scss'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { IoIosArrowForward } from 'react-icons/io'
import Verified from '../assets/payments/verified.webp'
import Unverified from '../assets/payments/unverified.png'
import { useGetOrderQuery } from '../store/services/orderService'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import StripePayment from '../components/stripePayment'
import axios from 'axios'
function reducer(state, action) {
  switch (action.type) {
    case 'PAY_REQUEST':
      return { ...state, loading: true }
    case 'PAY_SUCCESS':
      return { ...state, loading: false, success: true }
    case 'PAY_FAIL':
      return { ...state, loading: false, error: action.payload }
    case 'PAY_RESET':
      return { ...state, loading: false, success: false, error: false }
    default:
      return state
  }
}
export default function OrderScreen({ country }) {
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()
  const [{ loading, error, success }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    success: '',
  })
  const { userSession } = useSelector((state) => state.authReducer)
  const [orderData, setOrderData] = useState({})
  const { shipping_address } = orderData
  const { order_id } = useParams()

  const { data, refetch } = useGetOrderQuery({
    token: userSession.access_token,
    order_id: order_id,
  })

  const order = useMemo(
    () => data?.data?.order_data || {},
    [data?.data?.order_data]
  )
  const paypalID = useMemo(
    () => data?.data?.paypal_client_id || '',
    [data?.data?.paypal_client_id]
  )
  const stripe_key = useMemo(
    () => data?.data?.stripe_public_key || '',
    [data?.data?.stripe_public_key]
  )

  useEffect(() => {
    // If the client's order is empty, fetch from the server
    refetch()
    setOrderData(order)
  }, [order, refetch])

  // ------------ PayPal --------------

  useEffect(() => {
    if (success) {
      dispatch({
        type: 'PAY_RESET',
      })
    } else {
      paypalDispatch({
        type: 'resetOptions',
        value: {
          'client-id': paypalID,
          currency: 'THB',
        },
      })
      paypalDispatch({
        type: 'setLoadingStatus',
        value: 'pending',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success])

  function createOrderHanlder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: orderData.total,
            },
          },
        ],
      })
      .then((order_id) => {
        return order_id
      })
  }
  function onApproveHandler(data, actions) {
    return actions.order.capture().then(async function (details) {
      console.log('Details from Paypal', details)
      try {
        dispatch({ type: 'PAY_REQUEST' })
        const { data } = await axios.post(
          `/api/pay/${order_id}/paywithpaypal`,
          details,
          {
            headers: {
              authorization: `Bearer ${userSession.access_token}`,
            },
            withCredentials: true,
          }
        )
        console.log('Data from on Approve-->', data)
        dispatch({ type: 'PAY_SUCCESS', payload: data.data })
        window.location.reload()
      } catch (error) {
        dispatch({ type: 'PAY_ERROR', payload: error })
      }
    })
  }
  function onErroHandler(error) {
    console.log(error)
  }

  return (
    <>
      <Header country={country} />
      <div className={styles.order}>
        <div className={styles.container}>
          <div className={styles.order_infos}>
            <div className={styles.order_header}>
              <div className={styles.order_header_head}>
                Home <IoIosArrowForward /> Orders <IoIosArrowForward /> ID{' '}
                {orderData.order_id}
              </div>
              <div className={styles.order_header_status}>
                Payment Status :{' '}
                {orderData.isPaid ? (
                  <img src={Verified} alt="paid" />
                ) : (
                  <img src={Unverified} alt="unpaid" />
                )}
              </div>
              <div className={styles.order_header_status}>
                Order Status :
                <span
                  className={
                    orderData.status == 'Not Processed'
                      ? styles.not_processed
                      : orderData.status == 'Processing'
                      ? styles.processing
                      : orderData.status == 'Dispatched'
                      ? styles.dispatched
                      : orderData.status == 'Cancelled'
                      ? styles.cancelled
                      : orderData.status == 'Completed'
                      ? styles.completed
                      : ''
                  }>
                  {orderData.status}
                </span>
              </div>
            </div>
            <div className={styles.order_products}>
              {orderData?.products?.map((product) => (
                <div key={product.product_id} className={styles.product}>
                  <div className={styles.product_img}>
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className={styles.product_infos}>
                    <h1 className={styles.product_infos_name}>
                      {product.name}
                    </h1>
                    <div className={styles.product_infos_style}>
                      <img src={product.color.image} alt="" /> / {product.size}
                    </div>
                    <div className={styles.product_infos_priceQty}>
                      {product.price} THB x {product.qty}
                    </div>
                    <div className={styles.product_infos_total}>
                      {product.price * product.qty} THB
                    </div>
                  </div>
                </div>
              ))}
              <div className={styles.order_products_total}>
                {orderData?.coupon_applied ? (
                  <>
                    <div className={styles.order_products_total_sub}>
                      <span>Subtotal</span>
                      <span>{orderData.total_before_discount} THB</span>
                    </div>
                    <div className={styles.order_products_total_sub}>
                      <span>
                        Coupon Applied:{' '}
                        <em>
                          &quot;{`${orderData.coupon_applied}`.toUpperCase()}
                          &quot;
                        </em>
                      </span>
                      <span>
                        - {orderData.total_before_discount - orderData.total}{' '}
                        THB
                      </span>
                    </div>
                    <div
                      className={`${styles.order_products_total_sub} ${styles.bordertop}`}>
                      <span>TOTAL TO PAY</span>
                      <b>{orderData.total} THB</b>
                    </div>
                  </>
                ) : (
                  <div
                    className={`${styles.order_products_total_sub} ${styles.bordertop}`}>
                    <span>TOTAL TO PAY</span>
                    <b>{orderData.total} THB</b>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={styles.order_actions}>
            <div className={styles.order_address}>
              <h1>Customer&apos;s Order</h1>
              <div className={styles.order_address_user}>
                <div className={styles.order_address_user_infos}>
                  <img src={userSession.user.image} alt="" />
                  <div>
                    <span>{userSession.user.full_name}</span>
                    <span>{userSession.user.email}</span>
                  </div>
                </div>
              </div>
              <div className={styles.order_address_shipping}>
                <h2>Shipping Address</h2>
                <span>{shipping_address?.full_name}</span>
                <div>{shipping_address?.address}</div>
                <div>{shipping_address?.country}</div>
                <div>{shipping_address?.phone_number}</div>
              </div>
            </div>
            {!orderData.isPaid && (
              <div className={styles.order_payment}>
                {orderData.payment_method == 'paypal' && (
                  <div>
                    {isPending ? (
                      <span>loading...</span>
                    ) : (
                      <PayPalButtons
                        createOrder={createOrderHanlder}
                        onApprove={onApproveHandler}
                        onError={onErroHandler}></PayPalButtons>
                    )}
                  </div>
                )}
                {orderData.payment_method == 'credit_card' && (
                  <StripePayment
                    total={orderData.total}
                    order_id={orderData.order_id}
                    stripe_public_key={stripe_key}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
