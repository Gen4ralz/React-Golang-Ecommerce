import { useState } from 'react';
import styles from './styles.module.scss';
import { MdSecurity } from 'react-icons/md/';
import { BsSuitHeart } from 'react-icons/bs';
import { RiAccountPinCircleLine, RiArrowDropDownFill } from 'react-icons/ri';
import UserMenu from './UserMenu';
import { useSelector } from 'react-redux';

export default function Top({ country }) {
  const { userSession } = useSelector((state) => state.authReducer);
  const [visible, setVisible] = useState(false);
  return (
    <div className={styles.top}>
      <div className={styles.top_container}>
        <div></div>
        <div className={styles.top_list}>
          <div className={styles.li}>
            <img src={country.flag} alt="thai" />
            <span>{country.name} / THB</span>
          </div>
          <div className={styles.li}>
            <MdSecurity />
            <span>Buyer Protection</span>
          </div>
          <div className={styles.li}>
            <span>Customer Service</span>
          </div>
          <div className={styles.li}>
            <span>Help</span>
          </div>
          <div className={styles.li}>
            <BsSuitHeart />
            <span>Whishlist</span>
          </div>
          <div
            className={styles.li}
            onMouseOver={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
          >
            {userSession ? (
              <div className={styles.li}>
                <div className={styles.flex}>
                  <img src={userSession.user.image} alt="avatar" />
                  <span>{userSession.user.full_name}</span>
                  <RiArrowDropDownFill />
                </div>
              </div>
            ) : (
              <div className={styles.li}>
                <div className={styles.flex}>
                  <RiAccountPinCircleLine />
                  <span>Account</span>
                  <RiArrowDropDownFill />
                </div>
              </div>
            )}
            {visible && <UserMenu userSession={userSession} />}
          </div>
        </div>
      </div>
    </div>
  );
}
