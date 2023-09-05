import styles from './../styles/cart.module.scss';
import Header from '../components/cart/header';
import Empty from '../components/cart/empty';
import { useSelector } from 'react-redux';
import Product from '../components/cart/product';
import CartHeader from '../components/cart/cartHeader';
import Checkout from '../components/cart/checkout';
import { useEffect, useState } from 'react';
import Payment from '../components/cart/payment';
import { useNavigate } from 'react-router-dom';
import { useSaveCartMutation } from '../store/services/cartService';

export default function CartScreen() {
  const { userSession } = useSelector((state) => state.authReducer);
  const { cartItems } = useSelector((state) => state.cartReducer);
  const [selected, setSelected] = useState([]);

  const navigate = useNavigate();
  const [shippingFee, setShippingFee] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setShippingFee(selected.reduce((a, c) => a + Number(c.shipping), 0));
    setSubtotal(selected.reduce((a, c) => a + c.price * c.qty, 0).toFixed(2));
    setTotal(
      (
        selected.reduce((a, c) => a + c.price * c.qty, 0) + Number(shippingFee)
      ).toFixed(2)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const [SaveCart, response] = useSaveCartMutation();

  const saveCartToDBHandler = async () => {
    if (userSession) {
      try {
        let token = userSession.access_token;
        console.log('token:', token);
        let payload = {
          selected,
          token,
        };
        await SaveCart(payload);
      } catch (error) {
        console.log('Failed to save to database: ', error);
      }
    } else {
      navigate('/signin');
    }
  };

  useEffect(() => {
    if (response.isSuccess) {
      navigate('/checkout');
    }
  }, [navigate, response.isSuccess]);

  return (
    <>
      <Header />
      <div className={styles.cart}>
        {cartItems.length > 0 ? (
          <div className={styles.cart_container}>
            <CartHeader
              cartItems={cartItems}
              selected={selected}
              setSelected={setSelected}
            />
            <div className={styles.cart_products}>
              {cartItems.map((product) => (
                <Product
                  product={product}
                  key={product._uid}
                  selected={selected}
                  setSelected={setSelected}
                />
              ))}
            </div>
            <Checkout
              subtotal={subtotal}
              shippingFee={shippingFee}
              total={total}
              selected={selected}
              saveCartToDBHandler={saveCartToDBHandler}
            />
            <Payment />
          </div>
        ) : (
          <Empty />
        )}
      </div>
    </>
  );
}
