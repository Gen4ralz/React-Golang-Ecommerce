import styles from './styles.module.scss';
import visaLogo from '../../../assets/payments/visa.webp';
import paypalLogo from '../../../assets/payments/paypal.webp';
import mastercardLogo from '../../../assets/payments/mastercard.webp';
import protection from '../../../assets/payments/protection.png';

export default function Payment() {
  return (
    <div className={`${styles.card} ${styles.cart_method}`}>
      <h2 className={styles.header}>Payment Methods</h2>
      <div className={styles.images}>
        <img src={visaLogo} alt="visa" />
        <img src={mastercardLogo} alt="visa" />
        <img src={paypalLogo} alt="visa" />
      </div>
      <h2 className={styles.header}>Buyer Protection</h2>
      <div className={styles.protection}>
        <img src={protection} alt="protection" />
        Get full refund if the item is not as described or if it&apos;s not
        deliver
      </div>
    </div>
  );
}
