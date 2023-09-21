import { useDispatch } from 'react-redux'
import styles from './styles.module.scss'
import { useRef } from 'react'
import { ErrorMessage, useField } from 'formik'
import warning from '../../../../assets/warning.png'

export default function Images({
  images,
  setImages,
  header,
  text,
  name,
  setColorImage,
  ...props
}) {
  const dispatch = useDispatch()
  const fileInput = useRef(null)
  const [meta, field] = useField({ name })
  const handleImages = () => {}
  return (
    <div className={styles.images}>
      <div
        className={`${styles.header} ${meta.error ? styles.header_error : ''}`}>
        <div className={styles.flex}>
          {meta.error && <img src={warning} alt="warning" />}
          {header}
        </div>
        <span>
          {meta.tocuhed && meta.error && (
            <div className={styles.error_msg}>
              <span></span>
              <ErrorMessage name={name} />
            </div>
          )}
        </span>
      </div>
      <input
        id={name}
        type="file"
        name={name}
        ref={fileInput}
        hidden
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleImages}
      />
      <button
        type="reset"
        disabled={images.length == 6}
        style={{ opacity: `${images.length == 6 && '0.5'}` }}
        onClick={() => fileInput.current.click()}
        className={`${styles.btn} ${styles.btn_primary}`}>
        {text}
      </button>
    </div>
  )
}
