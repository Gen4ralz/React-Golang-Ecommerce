import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './styles.module.scss'
import { AiFillDelete, AiTwotoneEdit } from 'react-icons/ai'
import { toast } from 'react-toastify'
import {
  useRemoveCategoryMutation,
  useUpdateCategoryMutation,
} from '../../../store/services/dashboardService'

export default function ListItem({ category, setCategories, token }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const input = useRef(null)

  const [removeCategory, removeCategory_response] = useRemoveCategoryMutation()
  const dataAfterRemove = useMemo(
    () => removeCategory_response?.data?.data,
    [removeCategory_response.data]
  )

  const handleRemove = async (id) => {
    try {
      let payload = {
        id: {
          id: id,
        },
        token: token,
      }
      await removeCategory(payload)
    } catch (error) {
      toast.error(error)
    }
  }

  useEffect(() => {
    if (removeCategory_response.isSuccess) {
      setCategories(dataAfterRemove)
      toast.success(removeCategory_response?.data?.message)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removeCategory_response.isSuccess])

  // --------------- Update Category -------------------

  const [updateCategory, updateCategory_response] = useUpdateCategoryMutation()
  const dataAfterUpdate = useMemo(
    () => updateCategory_response?.data?.data,
    [updateCategory_response.data]
  )

  const handleUpdate = async (id) => {
    try {
      let payload = {
        update: {
          id: id,
          name: name,
        },
        token: token,
      }
      await updateCategory(payload)
    } catch (error) {
      toast.error(error)
    }
  }
  useEffect(() => {
    if (updateCategory_response.isSuccess) {
      setCategories(dataAfterUpdate)
      setOpen(false)
      toast.success(updateCategory_response?.data?.message)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateCategory_response.isSuccess])

  return (
    <li className={styles.list_item}>
      <input
        className={open ? styles.open : ''}
        type="text"
        value={name ? name : category.name}
        onChange={(e) => setName(e.target.value)}
        disabled={!open}
        ref={input}
      />
      {open && (
        <div className={styles.list_item_expand}>
          <button
            className={styles.btn}
            onClick={() => handleUpdate(category._id)}>
            Save
          </button>
          <button
            className={styles.btn}
            onClick={() => {
              setOpen(false)
              setName('')
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
        <AiFillDelete onClick={() => handleRemove(category._id)} />
      </div>
    </li>
  )
}
