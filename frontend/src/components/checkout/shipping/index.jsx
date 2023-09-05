import { useState } from 'react';
import styles from './styles.module.scss';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import ShippingInput from '../../inputs/shippingInput';
import { countries } from '../../../data/countries';
import SingularSelect from '../../selects/SingularSelect';
import { FaIdCard, FaMapMarkerAlt } from 'react-icons/fa';
import { GiPhone } from 'react-icons/gi';
import { IoMdArrowDropupCircle } from 'react-icons/io';
import { AiOutlinePlus } from 'react-icons/ai';
import { IoIosRemoveCircleOutline } from 'react-icons/io';

const initialValues = {
  full_name: '',
  phone_number: '',
  address: '',
  country: 'Thailand',
};

export default function Shipping({
  user,
  addresses,
  setAddresses,
  setActive,
  setDelete,
}) {
  const userInfo = user.user;
  const [visible, setVisible] = useState(
    userInfo?.addresses.length ? false : true
  );
  const [shipping, setShipping] = useState(initialValues);
  const { full_name, phone_number, address, country } = shipping;
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const validate = Yup.object({
    full_name: Yup.string()
      .required('Full name is required.')
      .min(3, 'Full name must be atleast 3 characters long.')
      .max(20, 'Full name must be less than 20 characters long.'),
    phone_number: Yup.string()
      .required('Phone number is required.')
      .matches(phoneRegExp, 'Phone number is not valid')
      .min(10, 'too short')
      .max(10, 'too long'),
    address: Yup.string()
      .required('Address is required.')
      .min(5, 'Address should contain 5-100 characters.')
      .max(100, 'Address should contain 5-100 characters.'),
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setShipping({ ...shipping, [name]: value });
  };

  const saveShippingHandler = async () => {
    try {
      await setAddresses(shipping);
    } catch (error) {
      console.log('Failed to save shipping: ', error);
    }
  };

  const changeActiveHandler = async (id) => {
    try {
      await setActive(id);
    } catch (error) {
      console.log('Failed to change active: ', error);
    }
  };

  const deleteHandler = async (id) => {
    try {
      await setDelete(id);
    } catch (error) {
      console.log('Failed to delete address: ', error);
    }
  };

  const sortedAddresses = addresses
    ? addresses
        .filter((address) => address.id !== null)
        .slice()
        .sort((a, b) => a.id - b.id)
    : [];

  return (
    <div className={styles.shipping}>
      <div className={styles.header}>
        <h3>Shipping Informations</h3>
      </div>
      <div className={styles.addresses}>
        {sortedAddresses.map((address) => (
          <div
            className={`${styles.address} ${address.active && styles.active}`}
            key={address.id}
            onClick={() => changeActiveHandler(address.id)}
          >
            <div
              className={styles.address_delete}
              onClick={() => deleteHandler(address.id)}
            >
              <IoIosRemoveCircleOutline />
            </div>
            <div className={styles.address_side}>
              <img src={userInfo.image} alt="" />
            </div>
            <div className={styles.address_col}>
              <span>
                <FaIdCard />
                {address.full_name ? address.full_name.toUpperCase() : ''}
              </span>
              <span>
                <GiPhone />
                {address.phone_number}
              </span>
            </div>
            <div className={styles.address_col}>
              <span>
                <FaMapMarkerAlt />
                {address.address}
              </span>
              <span>{address.country}</span>
            </div>
            <span
              className={styles.active_text}
              style={{
                display: `${!address.active && 'none'}`,
              }}
            >
              Active
            </span>
          </div>
        ))}
      </div>
      <button className={styles.hide_show} onClick={() => setVisible(!visible)}>
        {visible ? (
          <span>
            <IoMdArrowDropupCircle style={{ fontSize: '2rem', fill: '#222' }} />
          </span>
        ) : (
          <span>
            ADD NEW ADDRESS <AiOutlinePlus />
          </span>
        )}
      </button>
      {visible && (
        <Formik
          enableReinitialize
          initialValues={{ full_name, phone_number, address, country }}
          validationSchema={validate}
          onSubmit={() => {
            saveShippingHandler();
          }}
        >
          {() => (
            <Form>
              <SingularSelect
                name="country"
                value={country}
                placeholder="*Country"
                handleChange={handleChange}
                data={countries}
              />
              <div className={styles.col}>
                <ShippingInput
                  name="full_name"
                  placeholder="*Full Name"
                  onChange={handleChange}
                />
              </div>
              <ShippingInput
                name="address"
                placeholder="*Address"
                onChange={handleChange}
              />
              <ShippingInput
                name="phone_number"
                placeholder="*Phone number"
                onChange={handleChange}
              />
              <button type="submit">Save Address</button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}
