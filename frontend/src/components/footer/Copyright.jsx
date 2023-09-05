import { Link } from 'react-router-dom';
import styles from './styles.module.scss';
import { IoLocationSharp } from 'react-icons/io5';

export default function Copyrigh({ country }) {
  return (
    <div className={styles.footer_copyright}>
      <section>©2023 DOSIMPLE All Rights Reserved.</section>
      <section>
        <div className={styles.ul}>
          {data.map((link) => (
            <div key={link.name} className={styles.li}>
              <Link href={link.link}>{link.name}</Link>
            </div>
          ))}
          <div className={styles.li}>
            <a>
              <IoLocationSharp /> {country.name}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

const data = [
  {
    name: 'Privacy Center',
    link: '',
  },
  {
    name: 'Privacy & Cookie Policy',
    link: '',
  },
  {
    name: 'Manage Cookies',
    link: '',
  },
  {
    name: 'Terms & Conditions',
    link: '',
  },
  {
    name: 'Copyright Notice',
    link: '',
  },
];
