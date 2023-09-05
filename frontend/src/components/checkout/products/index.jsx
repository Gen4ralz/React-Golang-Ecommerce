import styles from './styles.module.scss';

export default function Products({ cart }) {
  const carts = cart ? cart : {};
  const products = carts?.products ? carts.products : [];
  console.log('Cart in component->', cart);
  return (
    <div className={styles.products}>
      <div className={styles.products_header}>
        <h3>Cart</h3>
        <span>
          {carts?.products?.length == 1
            ? '1 item'
            : `${cart?.products?.length} items`}
        </span>
      </div>
      <div className={styles.products_wrap}>
        {products.map((product) => (
          <div className={styles.product} key={product.product_id}>
            <div className={styles.product_img}>
              <img src={product.image} alt="" />
              <div className={styles.product_infos}>
                <img src={product.color.image} alt="" />
                <span>{product.size}</span>
                <span>x{product.qty}</span>
              </div>
            </div>
            <div className={styles.product_name}>
              {product.name.length > 18
                ? `${product.name.substring(0, 20)}...`
                : product.name}
            </div>
            <div className={styles.product_price}>
              {(product.price * product.qty).toFixed(2)} THB
            </div>
          </div>
        ))}
      </div>
      <div className={styles.products_total}>
        Subtotal : <b>{cart?.cart_total} THB</b>
      </div>
    </div>
  );
}
