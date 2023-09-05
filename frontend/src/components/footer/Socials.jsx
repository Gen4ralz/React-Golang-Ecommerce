import styles from './styles.module.scss';
import { FaFacebookF } from 'react-icons/fa';
import { BsInstagram, BsTwitter, BsYoutube } from 'react-icons/bs';

export default function Socials() {
  return (
    <div className={styles.footer_socials}>
      <section>
        <h3>STAY CONNECTED</h3>
        <div className={styles.ul}>
          <div className={styles.li}>
            <a href="" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </a>
          </div>
          <div className={styles.li}>
            <a href="" target="_blank" rel="noopener noreferrer">
              <BsInstagram />
            </a>
          </div>
          <div className={styles.li}>
            <a href="" target="_blank" rel="noopener noreferrer">
              <BsTwitter />
            </a>
          </div>
          <div className={styles.li}>
            <a href="" target="_blank" rel="noopener noreferrer">
              <BsYoutube />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
