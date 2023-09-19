import { useMemo } from 'react'
import Layout from '../../../../components/admin/layout'
import { useGetProductsQuery } from '../../../../store/services/dashboardService'
import styles from '../../../../styles/products.module.scss'
import { useSelector } from 'react-redux'
import ProductCard from '../../../../components/admin/products/productCard'

export default function AllProductScreen() {
  const { userSession } = useSelector((state) => state.authReducer)
  const { data: productData } = useGetProductsQuery({
    token: userSession.access_token,
  })
  const products = useMemo(() => productData?.data || [], [productData])
  console.log(products)
  return (
    <Layout>
      <div className={styles.header}>All Products</div>
      {products.map((product) => (
        <ProductCard product={product} key={product._id} />
      ))}
    </Layout>
  )
}
