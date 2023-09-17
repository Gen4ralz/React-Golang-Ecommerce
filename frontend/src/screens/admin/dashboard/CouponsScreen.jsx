import { useEffect, useMemo, useState } from 'react'
import Layout from '../../../components/admin/layout'
import { useSelector } from 'react-redux'
import { useGetCouponsQuery } from '../../../store/services/dashboardService'
import Create from '../../../components/admin/coupons/Create'
import List from '../../../components/admin/coupons/List'

export default function Coupons() {
  const { userSession } = useSelector((state) => state.authReducer)
  const [data, setData] = useState([])

  const {
    data: couponData,
    refetch,
    isSuccess,
  } = useGetCouponsQuery({
    token: userSession.access_token,
  })

  const coupons = useMemo(() => couponData?.data || {}, [couponData])
  console.log(data)

  useEffect(() => {
    refetch()
    if (isSuccess) {
      setData(coupons)
    }
  }, [coupons, data.length, isSuccess, refetch])
  return (
    <div>
      <Layout>
        <div>
          <Create setCoupons={setData} token={userSession.access_token} />
          <List
            coupons={data}
            setCoupons={setData}
            token={userSession.access_token}
          />
        </div>
      </Layout>
    </div>
  )
}
