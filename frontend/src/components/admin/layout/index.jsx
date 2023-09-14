import { useSelector } from 'react-redux'
import Sidebar from './sidebar'
import styles from './styles.module.scss'

export default function Layout({ children }) {
  const { expandSidebar } = useSelector((state) => state.expandReducer)
  const showSidebar = expandSidebar
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div
        style={{ marginLeft: `${showSidebar ? '280px' : '80px'}` }}
        className={styles.layout_main}>
        {children}
      </div>
    </div>
  )
}
