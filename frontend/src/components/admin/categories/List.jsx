import ListItem from './ListItem'
import styles from './styles.module.scss'

export default function List({ categories, setCategories, token }) {
  return (
    <div className={styles.list}>
      {categories.map((category) => (
        <ListItem
          category={category}
          key={category._id}
          setCategories={setCategories}
          token={token}
        />
      ))}
    </div>
  )
}
