import styles from './styles.module.scss';

export default function Checkout({
  subtotal,
  shippingFee,
  total,
  selected,
  saveCartToDBHandler,
}) {
  return (
    <div className={`${styles.cart_checkout} ${styles.card}`}>
      <h2>Order Summary</h2>
      <div className={styles.cart_checkout_line}>
        <span>Subtotal</span>
        <span>{subtotal} THB</span>
      </div>
      <div className={styles.cart_checkout_line}>
        <span>Shipping</span>
        <span>+{shippingFee} THB</span>
      </div>
      <div className={styles.cart_checkout_total}>
        <span>Total</span>
        <span>{total} THB</span>
      </div>
      <div className={styles.submit}>
        <button
          disabled={selected.length == 0}
          style={{
            background: `${selected.length == 0 ? '#eee' : ''}`,
            cursor: `${selected.length == 0 ? 'not-allowed' : ''}`,
          }}
          onClick={() => saveCartToDBHandler()}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
