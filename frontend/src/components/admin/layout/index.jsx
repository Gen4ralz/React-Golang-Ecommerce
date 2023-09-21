import { useDispatch, useSelector } from 'react-redux'
import Sidebar from './sidebar'
import styles from './styles.module.scss'
import DialogModal from '../../dialogModal'
import { useEffect } from 'react'
import { hideDialog } from '../../../store/reducers/dialogReducer'

export default function Layout({ children }) {
  const { expandSidebar } = useSelector((state) => state.expandReducer)
  const showSidebar = expandSidebar
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(hideDialog())
  }, [dispatch])
  return (
    <div className={styles.layout}>
      <DialogModal />
      <Sidebar />
      <div
        style={{ marginLeft: `${showSidebar ? '280px' : '80px'}` }}
        className={styles.layout_main}>
        {children}
      </div>
    </div>
  )
}
