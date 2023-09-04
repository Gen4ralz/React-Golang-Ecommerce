import { Link } from 'react-router-dom';
import styles from './styles.module.scss';
import { RiSearch2Line } from 'react-icons/ri';
import { FaOpencart } from 'react-icons/fa';
import logo from '../../assets/logo512.png';

export default function Main() {
  return (
    <div className={styles.main}>
      <div className={styles.main_container}>
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="logo" />
        </Link>
        <div className={styles.search}>
          <input type="text" placeholder="Search..." />
          <div className={styles.search_icon}>
            <RiSearch2Line />
          </div>
        </div>
        <Link to="/cart" className={styles.cart}>
          <FaOpencart />
          <span>0</span>
        </Link>
      </div>
    </div>
  );
}
