import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { compareArrays } from '../../../../utils/compareArrays';

export default function CartHeader({ cartItems, selected, setSelected }) {
  const [active, setActive] = useState();

  useEffect(() => {
    const check = compareArrays(cartItems, selected);
    setActive(check);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const handleSelectAll = () => {
    if (selected.length !== cartItems.length) {
      setSelected(cartItems);
    } else {
      setSelected([]);
    }
  };
  return (
    <div className={`${styles.cart_header} ${styles.card}`}>
      <h1>Item Summary({cartItems.length})</h1>
      <div className={styles.flex} onClick={() => handleSelectAll()}>
        <div
          className={`${styles.checkbox} ${active ? styles.active : ''}`}
        ></div>
        <span>Select all items</span>
      </div>
    </div>
  );
}
