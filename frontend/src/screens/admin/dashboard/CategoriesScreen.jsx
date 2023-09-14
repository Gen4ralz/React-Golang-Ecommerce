import { useEffect, useMemo, useState } from 'react'
import Layout from '../../../components/admin/layout'
import { useSelector } from 'react-redux'
import { useGetCategoriesQuery } from '../../../store/services/dashboardService'
import Create from '../../../components/admin/categories/Create'

export default function CategoriesScreen() {
  const { userSession } = useSelector((state) => state.authReducer)
  const [data, setData] = useState([])
  console.log('Data', data)
  const {
    data: categoryData,
    refetch,
    isSuccess,
  } = useGetCategoriesQuery({
    token: userSession.access_token,
  })

  const categories = useMemo(() => categoryData?.data || {}, [categoryData])

  useEffect(() => {
    if (categories.length == 0) {
      refetch()
    } else if (isSuccess) {
      setData(categories)
    }
  }, [categories, data.length, isSuccess, refetch])
  return (
    <div>
      <Layout>
        <div>
          <Create setCategories={setData} token={userSession.access_token} />
        </div>
      </Layout>
    </div>
  )
}
