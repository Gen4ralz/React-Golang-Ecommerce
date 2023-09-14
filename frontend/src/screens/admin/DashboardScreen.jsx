import { toast } from 'react-toastify'
import Layout from '../../components/admin/layout'
import styles from '../../styles/dashboard.module.scss'

export default function Dashboard() {
  return (
    <div>
      <Layout>
        <button onClick={() => toast.success('Everything is working fine!')}>
          Click to show
        </button>
      </Layout>
    </div>
  )
}
