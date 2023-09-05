import styles from './styles.module.scss';
import storeLogo from '../../../assets/store.webp';
import { BsHeart } from 'react-icons/bs';
import { AiOutlineDelete } from 'react-icons/ai';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { updateCart } from '../../../store/reducers/cartReducer';
import { useEffect, useState } from 'react';

export default function Product({ product, selected, setSelected }) {
  const { cartItems } = useSelector((state) => state.cartReducer);
  const dispatch = useDispatch();

  const [active, setActive] = useState();
  useEffect(() => {
    const check = selected.find((p) => p._uid == product._uid);
    setActive(check);
  }, [product._uid, selected]);

  const updateQty = (type) => {
    let newCart = cartItems.map((p) => {
      if (p._uid == product._uid) {
        return {
          ...p,
          qty: type == 'plus' ? product.qty + 1 : product.qty - 1,
        };
      }
      return p;
    });
    dispatch(updateCart(newCart));
  };
  const removeProduct = (id) => {
    let newCart = cartItems.filter((p) => {
      return p._uid != id;
    });
    dispatch(updateCart(newCart));
  };
  const handleSelect = () => {
    if (active) {
      setSelected(selected.filter((p) => p._uid !== product._uid));
    } else {
      setSelected([...selected, product]);
    }
  };
  return (
    <div className={`${styles.card} ${styles.product}`}>
      {product.quantity < 1 && <div className={styles.blur}></div>}
      <div className={styles.product_header}>
        <img src={storeLogo} alt="" />
        DOSIMPLE STORE
      </div>
      <div className={styles.product_image}>
        <div
          className={`${styles.checkbox} ${active ? styles.active : ''}`}
          onClick={() => handleSelect()}
        ></div>
        <img src={product.images[0].url} alt="" />
        <div className={styles.col}>
          <div className={styles.grid}>
            <h1>
              {product.name.length > 30
                ? `${product.name.substring(0, 30)}`
                : product.name}
            </h1>
            <div style={{ zIndex: '2' }}>
              <BsHeart />
            </div>
            <div
              style={{ zIndex: '2' }}
              onClick={() => removeProduct(product._uid)}
            >
              <AiOutlineDelete />
            </div>
          </div>
          <div className={styles.product_style}>
            <img src={product.color.image} alt="" />
            {product.size && <span>{product.size}</span>}
            {product.price && <span>{product.price.toFixed(2)} THB</span>}
            <MdOutlineKeyboardArrowRight />
          </div>
          <div className={styles.product_priceQty}>
            <div className={styles.product_priceQty_price}>
              <span className={styles.price}>
                {(product.price * product.qty).toFixed(2)} THB
              </span>
              {product.price !== product.price_before && (
                <span className={styles.price_before}>
                  {product.price_before} THB
                </span>
              )}
              {product.discount > 0 && (
                <span className={styles.discount}>-{product.discount}%</span>
              )}
            </div>
            <div className={styles.product_priceQty_qty}>
              <button
                disabled={product.qty < 2}
                onClick={() => updateQty('minus')}
              >
                -
              </button>
              <span>{product.qty}</span>
              <button
                disabled={product.qty == product.quantity}
                onClick={() => updateQty('plus')}
              >
                +
              </button>
            </div>
          </div>
          <div className={styles.product_shipping}>
            {product.shipping
              ? `+${product.shipping} THB Shipping fee`
              : 'Free Shipping'}
          </div>
          {product.quantity < 1 && (
            <div className={styles.notAvailable}>
              This product is out of stock
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
