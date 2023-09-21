import { MenuItem, TextField } from '@mui/material'
import { ErrorMessage, useField } from 'formik'
import styles from './styles.module.scss'
import warning from '../../assets/warning.png'

export default function SingularSelectProduct({
  data,
  handleChange,
  placeholder,
  header,
  ...rest
}) {
  const [field, meta] = useField(rest)
  return (
    <div style={{ marginBottom: '1rem' }}>
      {header && (
        <div
          className={`${styles.heading} ${
            meta.error ? styles.heading_error : ''
          }`}>
          <div className={styles.flex}>
            {meta.error && <img src={warning} alt="warning" />}
            {header}
          </div>
        </div>
      )}
      <TextField
        variant="outlined"
        name={field.name}
        select
        label={placeholder}
        value={field.value || ''}
        onChange={handleChange}
        className={`${styles.select} ${
          meta.touched && meta.error && styles.error_select
        }`}>
        <MenuItem key={''} value={''}>
          No Selected / Or Empty
        </MenuItem>
        {data.map((option) => (
          <MenuItem key={option.name} value={option.name}>
            {option.name}
          </MenuItem>
        ))}
      </TextField>
      {meta.touched && meta.error && (
        <p className={styles.error_msg}>
          <ErrorMessage name={field.name} />
        </p>
      )}
    </div>
  )
}
