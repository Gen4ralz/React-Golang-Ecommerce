import styles from './styles.module.scss';
import EmptyLogo from '../../../assets/empty.png';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Empty() {
  const { data: session } = useSelector((state) => state.authReducer);
  return (
    <div className={styles.empty}>
      <img src={EmptyLogo} alt="" />
      <h1>Cart is empty</h1>
      {!session && (
        <Link to="/signin">
          <button className={styles.empty_btn}>SIGN IN / REGISTER</button>
        </Link>
      )}
      <Link to="/browse">
        <button className={`${styles.empty_btn} ${styles.empty_btn_v2}`}>
          SHOP NOW
        </button>
      </Link>
    </div>
  );
}
