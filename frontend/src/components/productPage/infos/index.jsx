import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';
import { Rating } from '@mui/material';
import { useEffect, useState } from 'react';
import { TbPlus, TbMinus } from 'react-icons/tb';
import { BsHandbagFill, BsHeart } from 'react-icons/bs';
import Accordian from './accordian';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, updateCart } from '../../../store/reducers/cartReducer';
import axios from 'axios';

export default function Infos({ product, setActiveImg }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const styleQuery = params.get('style');
  const sizeQuery = params.get('size') ? params.get('size') : '0';
  const [size, setSize] = useState(sizeQuery);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const { cartItems } = useSelector((state) => state.cartReducer);
  console.log('Cart: ', cartItems);

  useEffect(() => {
    setSize('');
    setQty(1);
  }, [styleQuery]);

  useEffect(() => {
    if (qty > product.quantity) {
      setQty(product.quantity);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizeQuery]);

  const addToCartHandler = async () => {
    if (!sizeQuery) {
      setError('Please select a size');
      return;
    }

    const { data: response } = await axios.get(
      `/api/product/getProductById/${product.id}?style=${product.style}&size=${sizeQuery}`
    );
    const data = response?.data ? response?.data : {};
    if (qty > data.quantity) {
      setError('The Quantity you have choosed is more than in stock.');
      return;
    } else if (data.quantity < 1) {
      setError('This Product is out of stock.');
      return;
    } else {
      let _uid = `${data.id}_${product.style}_${sizeQuery}`;
      let exist = cartItems.find((p) => p._uid === _uid);
      if (exist) {
        let newCart = cartItems.map((p) => {
          if (p._uid == exist._uid) {
            return { ...p, qty: qty };
          }
          return p;
        });
        dispatch(updateCart(newCart));
        navigate('/cart');
      } else {
        dispatch(addToCart({ ...data, qty, size: data.size, _uid }));
        navigate('/cart');
      }
    }
  };

  return (
    <div className={styles.infos}>
      <div className={styles.infos_container}>
        <h1 className={styles.infos_name}>{product.name}</h1>
        <p className={styles.infos_sku}>{product.sku}</p>
        <div className={styles.infos_rating}>
          <Rating
            name="half-rating-read"
            defaultValue={product.rating}
            precision={0.5}
            readOnly
            style={{ color: '#FACF19' }}
          />
          ({product.numReviews}
          {product.numReviews == 1 ? ' review' : ' reviews'})
        </div>
        <div className={styles.infos_price}>
          <h2>{product.price} THB</h2>
          {product.discount > 0 ? (
            <h3>
              {size && <span>{product.price_before} THB</span>}
              <span>(-{product.discount}%)</span>
            </h3>
          ) : (
            ''
          )}
        </div>
        <span className={styles.infos_shipping}>
          {product.shipping
            ? `+${product.shipping} THB Shipping fee`
            : 'Free shipping '}
          <br />
        </span>
        <span>
          {size
            ? product.quantity
            : product.sizes.reduce((start, next) => start + next.qty, 0)}{' '}
          pieces available.
        </span>
        <div className={styles.infos_sizes}>
          <h4>Select a Size : </h4>
          <div className={styles.infos_sizes_wrap}>
            {product.sizes.map((size, index) => (
              <Link
                key={size.size}
                to={`/product/${product.slug}?style=${styleQuery}&size=${index}`}
              >
                <div
                  className={`${styles.infos_sizes_size} ${
                    index == sizeQuery && styles.active_size
                  }`}
                  onClick={() => setSize(size.size)}
                >
                  {size.size}
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className={styles.infos_colors}>
          {product.colors &&
            product.colors.map((color, index) => (
              <span
                key={color.color}
                className={index == styleQuery ? styles.active_color : ''}
                onMouseOver={() =>
                  setActiveImg(product.subProducts[index].images[0].url)
                }
                onMouseLeave={() => setActiveImg('')}
              >
                <Link to={`/product/${product.slug}?style=${index}`}>
                  <img src={color.image} />
                </Link>
              </span>
            ))}
        </div>
        <div className={styles.infos_qty}>
          <button
            onClick={() => qty > 1 && setQty((prev) => prev - 1)}
            className={styles.qty_button}
          >
            <TbMinus />
          </button>
          <span>{qty}</span>
          <button
            onClick={() => qty < product.quantity && setQty((prev) => prev + 1)}
            className={styles.qty_button}
          >
            <TbPlus />
          </button>
        </div>
        <div className={styles.infos_actions}>
          <button
            disabled={product.quantity < 1}
            style={{ cursor: `${product.quantity < 1 ? 'not-allowed' : ''}` }}
            onClick={() => addToCartHandler()}
          >
            <BsHandbagFill />
            <b>ADD TO CART</b>
          </button>
          <button>
            <BsHeart />
            WISHLIST
          </button>
        </div>
        {error && <span className={styles.error}>{error}</span>}
        <Accordian details={[product.description, ...product.details]} />
      </div>
    </div>
  );
}
