import { useEffect, useMemo, useState } from 'react'
import Header from '../components/header'
import styles from '../styles/order.module.scss'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { IoIosArrowForward } from 'react-icons/io'
import Verified from '../assets/payments/verified.webp'
import Unverified from '../assets/payments/unverified.png'
import { useGetOrderQuery } from '../store/services/orderService'

export default function OrderScreen({ country }) {
  const { userSession } = useSelector((state) => state.authReducer)
  const [orderData, setOrderData] = useState({})
  const { shipping_address } = orderData
  const { order_id } = useParams()

  const { data, refetch } = useGetOrderQuery({
    token: userSession.access_token,
    order_id: order_id,
  })

  const order = useMemo(() => data?.data || {}, [data])

  useEffect(() => {
    if (Object.keys(order).length === 0) {
      // If the client's order is empty, fetch from the server
      refetch()
    } else {
      setOrderData(order)
    }
  }, [order, refetch])

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
                {orderData?.couponApplied ? (
                  <>
                    <div className={styles.order_products_total_sub}>
                      <span>Subtotal</span>
                      <span>{orderData.totalBeforeDiscount}</span>
                    </div>
                    <div className={styles.order_products_total_sub}>
                      <span>Coupon Applied {orderData.couponApplied}</span>
                      <span>
                        -{' '}
                        {(
                          orderData.totalBeforeDiscount - orderData.total
                        ).toFixed(2)}{' '}
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
          </div>
        </div>
      </div>
    </>
  )
}
