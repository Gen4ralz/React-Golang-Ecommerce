import ListItem from './ListItem'
import styles from './styles.module.scss'

export default function List({ coupons, setCoupons, token }) {
  return (
    <div className={styles.list}>
      {coupons.map((coupon) => (
        <ListItem
          coupon={coupon}
          key={coupon.coupon_id}
          setCoupons={setCoupons}
          token={token}
        />
      ))}
    </div>
  )
}
