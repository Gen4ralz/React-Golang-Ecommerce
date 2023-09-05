import { Link } from 'react-router-dom';
import styles from './styles.module.scss';
import logo from '../../../assets/logo512.png';
import { MdPlayArrow } from 'react-icons/md';

export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.header_container}>
        <div className={styles.header_left}>
          <Link to="/">
            <img src={logo} alt="" />
          </Link>
        </div>
        <div className={styles.header_right}>
          <Link to="/browse">
            Continue Shopping
            <MdPlayArrow />
          </Link>
        </div>
      </div>
    </div>
  );
}
