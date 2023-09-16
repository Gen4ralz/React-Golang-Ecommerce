import { useEffect, useMemo, useState } from 'react'
import Layout from '../../../components/admin/layout'
import { useSelector } from 'react-redux'
import { useGetCategoriesQuery } from '../../../store/services/dashboardService'
import Create from '../../../components/admin/categories/Create'
import List from '../../../components/admin/categories/List'

export default function CategoriesScreen() {
  const { userSession } = useSelector((state) => state.authReducer)
  const [data, setData] = useState([])

  const {
    data: categoryData,
    refetch,
    isSuccess,
  } = useGetCategoriesQuery({
    token: userSession.access_token,
  })

  const categories = useMemo(() => categoryData?.data || {}, [categoryData])

  useEffect(() => {
    refetch()
    if (isSuccess) {
      setData(categories)
    }
  }, [categories, data.length, isSuccess, refetch])
  return (
    <div>
      <Layout>
        <div>
          <Create setCategories={setData} token={userSession.access_token} />
          <List
            categories={data}
            setCategories={setData}
            token={userSession.access_token}
          />
        </div>
      </Layout>
    </div>
  )
}
