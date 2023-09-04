import { useDispatch } from 'react-redux';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';
import { logout } from './../../store/reducers/authReducer';

export default function UserMenu({ userSession }) {
  const dispatch = useDispatch();
  const userLogout = () => {
    dispatch(logout());
  };
  return (
    <div className={styles.menu}>
      <h4>Welcome to Dosimple!</h4>
      {userSession ? (
        <div className={styles.flex}>
          <img
            src={userSession.user.image}
            alt="avatar"
            className={styles.menu_img}
          />
          <div className={styles.col}>
            <span>Welcome Back,</span>
            <h3>{userSession.user.full_name}</h3>
            <span onClick={userLogout}>Sign out</span>
          </div>
        </div>
      ) : (
        <div className={styles.flex}>
          <Link to={'/signin'}>
            <button className={styles.btn_primary}>Register</button>
          </Link>
          <Link to="/signin">
            <button className={styles.btn_outlined}>Login</button>
          </Link>
        </div>
      )}
      <div>
        <div className={styles.li}>
          <Link to="/profile">Account</Link>
        </div>
        <div className={styles.li}>
          <Link to="">My Orders</Link>
        </div>
        <div className={styles.li}>
          <Link to="/profile/messages">Message Center</Link>
        </div>
        <div className={styles.li}>
          <Link to="/profile/address">Address</Link>
        </div>
        <div className={styles.li}>
          <Link to="/profile/whishlist">Whishlist</Link>
        </div>
      </div>
    </div>
  );
}
