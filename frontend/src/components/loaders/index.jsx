import styles from './styles.module.scss';
import PulseLoader from 'react-spinners/PulseLoader';

export default function DotLoaderSpinner({ loading }) {
  return (
    <div className={styles.loader}>
      <PulseLoader color="#2f82ff" loading={loading} margin={10} size={30} />
    </div>
  );
}
