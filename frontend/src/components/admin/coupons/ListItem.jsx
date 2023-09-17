import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './styles.module.scss'
import { AiFillDelete, AiTwotoneEdit } from 'react-icons/ai'
import { toast } from 'react-toastify'
import {
  useRemoveCouponMutation,
  useUpdateCouponMutation,
} from '../../../store/services/dashboardService'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { TextField } from '@mui/material'

export default function ListItem({ coupon, setCoupons, token }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [discount, setDiscount] = useState('')
  const tomorrow = new Date()
  tomorrow.getDate(tomorrow.getDate() + 1)
  const [startDate, setStartDate] = useState(new Date(coupon.start_date))
  const [endDate, setEndDate] = useState(new Date(coupon.end_date))

  const handleStartDate = (newValue) => {
    setStartDate(newValue)
  }

  const handleEndDate = (newValue) => {
    setEndDate(newValue)
  }
  const input = useRef(null)

  const [removeCoupon, removeCoupon_response] = useRemoveCouponMutation()
  const dataAfterRemove = useMemo(
    () => removeCoupon_response?.data?.data,
    [removeCoupon_response.data]
  )

  const handleRemove = async (id) => {
    try {
      let payload = {
        id: {
          id: id,
        },
        token: token,
      }
      await removeCoupon(payload)
    } catch (error) {
      toast.error(error)
    }
  }

  useEffect(() => {
    if (removeCoupon_response.isSuccess) {
      setCoupons(dataAfterRemove)
      toast.success(removeCoupon_response?.data?.message)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removeCoupon_response.isSuccess])

  // --------------- Update Category -------------------

  const [updateCoupon, updateCoupon_response] = useUpdateCouponMutation()
  const dataAfterUpdate = useMemo(
    () => updateCoupon_response?.data?.data,
    [updateCoupon_response.data]
  )

  const handleUpdate = async (id) => {
    try {
      let payload = {
        arg: {
          id: id,
          coupon: name || coupon.coupon,
          discount: discount || coupon.discount,
          start_date: startDate,
          end_date: endDate,
        },
        token: token,
      }
      await updateCoupon(payload)
    } catch (error) {
      toast.error(error)
    }
  }
  useEffect(() => {
    if (updateCoupon_response.isSuccess) {
      setCoupons(dataAfterUpdate)
      setOpen(false)
      toast.success(updateCoupon_response?.data?.message)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateCoupon_response.isSuccess])

  return (
    <li className={styles.list_item}>
      <input
        className={open ? styles.open : ''}
        type="text"
        value={name ? name : coupon.coupon}
        onChange={(e) => setName(e.target.value)}
        disabled={!open}
        ref={input}
      />
      {open && (
        <div className={styles.list_item_expand}>
          <input
            className={open ? styles.open : ''}
            type="text"
            value={discount ? discount : coupon.discount}
            onChange={(e) => setDiscount(e.target.value)}
            disabled={!open}
            ref={input}
          />
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
          <button
            className={styles.btn}
            onClick={() => handleUpdate(coupon.coupon_id)}>
            Save
          </button>
          <button
            className={styles.btn}
            onClick={() => {
              setOpen(false)
              setName('')
              setDiscount('')
              setStartDate(new Date(coupon.start_date))
              setEndDate(new Date(coupon.end_date))
            }}>
            Cancel
          </button>
        </div>
      )}
      <div className={styles.list_item_actions}>
        {!open && (
          <AiTwotoneEdit
            onClick={() => {
              setOpen((prev) => !prev)
              input.current.focus()
            }}
          />
        )}
        <AiFillDelete onClick={() => handleRemove(coupon.coupon_id)} />
      </div>
    </li>
  )
}
