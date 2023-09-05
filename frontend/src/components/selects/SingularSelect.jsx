import { MenuItem, TextField } from '@mui/material';
import { ErrorMessage, useField } from 'formik';
import styles from './styles.module.scss';

export default function SingularSelect({
  data,
  handleChange,
  placeholder,
  ...rest
}) {
  const [field, meta] = useField(rest);
  return (
    <div style={{ marginBottom: '1rem' }}>
      <TextField
        variant="outlined"
        name={field.name}
        select
        label={placeholder}
        value={field.value || 'Thailand'}
        onChange={handleChange}
        className={`${styles.select} ${
          meta.touched && meta.error & styles.error_select
        }`}
      >
        {data.map((option) => (
          <MenuItem key={option.code} value={option.name}>
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
  );
}
