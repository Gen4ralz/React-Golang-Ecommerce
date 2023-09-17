import { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import * as Yup from 'yup'
import { Form, Formik } from 'formik'
import AdminInput from '../../inputs/adminInput'
import { toast } from 'react-toastify'
import { useCreateCouponMutation } from '../../../store/services/dashboardService'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { TextField } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

export default function Create({ setCoupons, token }) {
  const [name, setName] = useState('')
  const [discount, setDiscount] = useState(0)
  const tomorrow = new Date()
  tomorrow.getDate(tomorrow.getDate() + 1)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(tomorrow)

  const handleStartDate = (newValue) => {
    setStartDate(newValue)
  }

  const handleEndDate = (newValue) => {
    setEndDate(newValue)
  }

  const validate = Yup.object({
    name: Yup.string()
      .required('Coupon name is required.')
      .min(2, 'Coupon name must be between 2 and 20 characters.')
      .max(20, 'Coupon name must be between 2 and 20 characters.'),
    discount: Yup.number()
      .required('Discount is required')
      .min(1, 'Discount must be at least 1 THB'),
  })
  const [createCoupon, createCoupon_response] = useCreateCouponMutation()
  const submitHandler = async () => {
    try {
      if (startDate.toString() == endDate.toString()) {
        return toast.error("You can't pick the same Dates.")
      } else if (endDate.getTime() - startDate.getTime() < 0) {
        return toast.error('Start Date cannot be more than the end date.')
      }
      let payload = {
        arg: {
          coupon: name,
          discount: discount,
          start_date: startDate,
          end_date: endDate,
        },
        token: token,
      }
      await createCoupon(payload)
    } catch (error) {
      toast.error(error)
    }
  }

  useEffect(() => {
    if (createCoupon_response.isSuccess) {
      setCoupons(createCoupon_response?.data?.data)
      setName('')
      setDiscount(0)
      setStartDate(new Date())
      setEndDate(tomorrow)
      toast.success(createCoupon_response?.data?.message)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createCoupon_response.isSuccess])
  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{ name, discount }}
        validationSchema={validate}
        onSubmit={() => {
          submitHandler()
        }}>
        {() => (
          <Form>
            <div className={styles.header}>Create a Coupon</div>
            <AdminInput
              type="text"
              label="Name"
              name="name"
              placeholder="Coupon name"
              onChange={(e) => setName(e.target.value)}
            />
            <AdminInput
              type="number"
              label="Discount"
              name="discount"
              placeholder="Discount"
              onChange={(e) => setDiscount(e.target.value)}
            />
            <div className={styles.date_picker}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  label="Start Date"
                  inputFormat="MM/dd/yyyy"
                  value={startDate}
                  onChange={handleStartDate}
                  renderInput={(params) => <TextField {...params} />}
                  minDate={new Date()}
                />
                <DesktopDatePicker
                  label="End Date"
                  inputFormat="MM/dd/yyyy"
                  value={endDate}
                  onChange={handleEndDate}
                  renderInput={(params) => <TextField {...params} />}
                  minDate={tomorrow}
                />
              </LocalizationProvider>
            </div>
            <div className={styles.btnWrap}>
              <button type="submit" className={styles.btnn}>
                <span>Add Coupon</span>
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  )
}
