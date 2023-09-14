import { useDispatch, useSelector } from 'react-redux'
import styles from './styles.module.scss'
import { toggleSidebar } from '../../../../store/reducers/expandReducer'
//---------------------
import {
  MdArrowForwardIos,
  MdOutlineCategory,
  MdSpaceDashboard,
} from 'react-icons/md'
import { FcSalesPerformance } from 'react-icons/fc'
import { ImUsers } from 'react-icons/im'
import { IoListCircleSharp, IoNotificationsSharp } from 'react-icons/io5'
import { AiFillMessage } from 'react-icons/ai'
import { FaThList } from 'react-icons/fa'
//---------------------
import { Link, useLocation } from 'react-router-dom'
import { BsPatchPlus } from 'react-icons/bs'
import {
  RiCoupon3Fill,
  RiLogoutCircleFill,
  RiSettingsLine,
} from 'react-icons/ri'

export default function Sidebar() {
  const location = useLocation()
  console.log('location', location)
  const { pathname } = location
  const route = pathname.split('/admin/dashboard')[1]
  console.log('route', route)
  const { userSession } = useSelector((state) => state.authReducer)
  const dispatch = useDispatch()
  const { expandSidebar } = useSelector((state) => state.expandReducer)
  const expand = expandSidebar
  const handleExpand = () => {
    dispatch(toggleSidebar())
  }

  return (
    <div className={`${styles.sidebar} ${expand ? styles.opened : ''}`}>
      <div className={styles.sidebar_toggle} onClick={() => handleExpand()}>
        <div
          style={{
            transform: `${expand ? 'rotate(180deg)' : ''}`,
            transition: 'all 0.2s',
          }}>
          <MdArrowForwardIos />
        </div>
      </div>
      <div className={styles.sidebar_container}>
        <div className={styles.sidebar_header}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className={styles.sidebar_user}>
          <img src={userSession?.user?.image} alt="avatar" />
          <div className={styles.show}>
            <span>Welcome Back!</span>
            <span>{userSession?.user?.full_name}</span>
          </div>
        </div>
        <ul className={styles.sidebar_list}>
          <Link to="/admin/dashboard">
            <li className={route == undefined ? styles.active : ''}>
              <MdSpaceDashboard />
              <span className={styles.show}>Dashboard</span>
            </li>
          </Link>
          <Link to="/admin/dashboard/sales">
            <li className={route == 'sales' ? styles.active : ''}>
              <FcSalesPerformance />
              <span className={styles.show}>Sales</span>
            </li>
          </Link>
          <Link to="/admin/dashboard/orders">
            <li className={route == 'orders' ? styles.active : ''}>
              <IoListCircleSharp />
              <span className={styles.show}>Orders</span>
            </li>
          </Link>
          <Link to="/admin/dashboard/users">
            <li className={route == 'users' ? styles.active : ''}>
              <ImUsers />
              <span className={styles.show}>Users</span>
            </li>
          </Link>
          <Link to="/admin/dashboard/messages">
            <li className={route == 'messages' ? styles.active : ''}>
              <AiFillMessage />
              <span className={styles.show}>Messages</span>
            </li>
          </Link>
        </ul>
        <div className={styles.sidebar_dropdown}>
          <div className={styles.sidebar_dropdown_heading}>
            <div className={styles.show}>Product</div>
          </div>
          <ul className={styles.sidebar_list}>
            <Link to="/admin/dashboard/product/all">
              <li className={route == 'product/all' ? styles.active : ''}>
                <FaThList />
                <span className={styles.show}>All Products</span>
              </li>
            </Link>
            <Link to="/admin/dashboard/product/create">
              <li className={route == 'product/create' ? styles.active : ''}>
                <BsPatchPlus />
                <span className={styles.show}>Create Product</span>
              </li>
            </Link>
          </ul>
        </div>
        <div className={styles.sidebar_dropdown}>
          <div className={styles.sidebar_dropdown_heading}>
            <div className={styles.show}>Categories / Subs</div>
          </div>
          <ul className={styles.sidebar_list}>
            <Link to="/admin/dashboard/categories">
              <li className={route == 'categories' ? styles.active : ''}>
                <MdOutlineCategory />
                <span className={styles.show}>Categories</span>
              </li>
            </Link>
            <Link to="/admin/dashboard/subCategories">
              <li className={route == 'subCategories' ? styles.active : ''}>
                <div style={{ transform: 'rotate(180deg' }}>
                  <MdOutlineCategory />
                </div>
                <span className={styles.show}>Sub Categories</span>
              </li>
            </Link>
          </ul>
        </div>
        <div className={styles.sidebar_dropdown}>
          <div className={styles.sidebar_dropdown_heading}>
            <div className={styles.show}>Coupons</div>
          </div>
          <ul className={styles.sidebar_list}>
            <Link to="/admin/dashboard/coupons">
              <li className={route == 'coupons' ? styles.active : ''}>
                <RiCoupon3Fill />
                <span className={styles.show}>Coupons</span>
              </li>
            </Link>
          </ul>
        </div>
        <nav>
          <ul
            className={`${styles.sidebar_list} ${
              expand ? styles.nav_flex : ''
            }`}>
            <Link>
              <li>
                <RiSettingsLine />
              </li>
            </Link>
            <Link>
              <li>
                <IoNotificationsSharp />
              </li>
            </Link>
            <Link>
              <li>
                <AiFillMessage />
              </li>
            </Link>
            <Link>
              <li>
                <RiLogoutCircleFill />
              </li>
            </Link>
          </ul>
        </nav>
      </div>
    </div>
  )
}
