import styles from './styles.module.scss';
import visa from '../../assets/payments/visa.webp';
import master from '../../assets/payments/mastercard.webp';
import paypal from '../../assets/payments/paypal.webp';

export default function Payment() {
  return (
    <div className={styles.footer_payment}>
      <h3>WE ACCEPT</h3>
      <div className={styles.footer_flexwrap}>
        <img src={visa} alt="" />
        <img src={master} alt="" />
        <img src={paypal} alt="" />
      </div>
    </div>
  );
}
