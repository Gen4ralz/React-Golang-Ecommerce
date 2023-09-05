import { paymentMethods } from '../../../data/paymentMethods';
import styles from './styles.module.scss';
import IMAGES from '../../../assets/payments/paymentImage';

export default function Payment({ paymentMethod, setPaymentMethod }) {
  return (
    <div className={styles.payment}>
      <div className={styles.header}>
        <h3>Payment Method</h3>
      </div>
      {paymentMethods.map((payment) => (
        <label
          htmlFor={payment.id}
          key={payment.id}
          className={styles.payment_item}
          onClick={() => setPaymentMethod(payment.id)}
          style={{
            background: `${paymentMethod === payment.id ? '#f5f5f5' : ''}`,
          }}
        >
          <input
            type="radio"
            name="payment"
            id={payment.id}
            checked={paymentMethod === payment.id}
            onChange={() => setPaymentMethod(payment.id)}
          />
          <img src={IMAGES[payment.name]} alt={payment.name} />
          <div className={styles.payment_item_col}>
            <span>Pay with {payment.name}</span>
            <p>
              {payment.images.length > 0
                ? payment.images.map((img) => (
                    <img key={img.name} src={IMAGES[img.name]} alt="" />
                  ))
                : payment.description}
            </p>
          </div>
        </label>
      ))}
    </div>
  );
}
