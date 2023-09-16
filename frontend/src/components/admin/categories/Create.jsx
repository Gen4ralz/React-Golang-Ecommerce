import { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import * as Yup from 'yup'
import { Form, Formik } from 'formik'
import AdminInput from '../../inputs/adminInput'
import { toast } from 'react-toastify'
import { useCreateCategoryMutation } from '../../../store/services/dashboardService'

export default function Create({ setCategories, token }) {
  const [name, setName] = useState('')
  const validate = Yup.object({
    name: Yup.string()
      .required('Category name is required.')
      .min(2, 'Category name must be between 2 and 20 characters.')
      .max(20, 'Category name must be between 2 and 20 characters.')
      .matches(
        /^[a-zA-Z\s]*$/,
        'Numbers and special characters are not allowed.'
      ),
  })
  const [createCategory, createCategory_response] = useCreateCategoryMutation()
  const submitHandler = async () => {
    try {
      let payload = {
        name: {
          name: name,
        },
        token: token,
      }
      await createCategory(payload)
    } catch (error) {
      toast.error(error)
    }
  }

  useEffect(() => {
    if (createCategory_response.isSuccess) {
      setCategories(createCategory_response?.data?.data)
      setName('')
      toast.success(createCategory_response?.data?.message)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createCategory_response.isSuccess])
  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{ name }}
        validationSchema={validate}
        onSubmit={() => {
          submitHandler()
        }}>
        {() => (
          <Form>
            <div className={styles.header}>Create a Category</div>
            <AdminInput
              type="text"
              label="Name"
              name="name"
              placeholder="Category name"
              onChange={(e) => setName(e.target.value)}
            />
            <div className={styles.btnWrap}>
              <button type="submit" className={styles.btnn}>
                <span>Add Category</span>
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  )
}
