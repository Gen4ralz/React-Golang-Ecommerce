import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import styles from './styles.module.scss'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useState } from 'react'
const CARD_OPTIONS = {
  iconStyle: 'solid',
  style: {
    base: {
      iconColor: '#000',
      color: '#000',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      ':-webkit-autofill': { color: '#000' },
      '::placeholder': { color: '#000' },
    },
    invalid: {
      iconColor: '#fd010169',
      color: '#fd010169',
    },
  },
}
export default function Form({ total, order_id }) {
  const { userSession } = useSelector((state) => state.authReducer)
  const token = userSession.access_token
  const [error, setError] = useState('')
  const [loadingg, setLoadingg] = useState(false)
  const stripe = useStripe()
  const elements = useElements()
  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    })

    if (!error) {
      try {
        const { id } = paymentMethod
        const res = await axios.post(
          `/api/pay/${order_id}/paywithstripe`,
          {
            amount: total,
            id,
          },
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        )
        console.log('Result from API-->', res)
        if (!res.data.error) {
          console.log('Payment was successful')
          window.location.reload()
        } else {
          setError('Payment was not successful')
        }
      } catch (error) {
        setError('An error occurred during payment.')
      } finally {
        setLoadingg(false)
      }
    } else {
      setError(error.message)
      setLoadingg(false)
    }
  }
  return (
    <div className={styles.stripe}>
      <form onSubmit={handleSubmit}>
        <CardElement options={CARD_OPTIONS} />
        <button type="submit">{loadingg ? 'Processing...' : 'PAY'}</button>
        {error && <span className={styles}>{error.message}</span>}
      </form>
    </div>
  )
}
