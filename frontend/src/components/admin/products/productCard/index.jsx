import styles from './styles.module.scss'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
import { Link } from 'react-router-dom'
import { TbEdit } from 'react-icons/tb'
import { AiOutlineEye } from 'react-icons/ai'
import { RiDeleteBin2Line } from 'react-icons/ri'

export default function ProductCard({ product }) {
  return (
    <div className={styles.product}>
      <h1 className={styles.product_name}>{product.name}</h1>
      <h2 className={styles.product_category}>#{product.category.name}</h2>
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        navigation={true}
        modules={[Navigation]}
        className={styles.productSwiper}
        style={{ padding: '5px 0 5px 5px' }}
        breakpoints={{
          450: {
            slidesPerView: 2,
          },
          600: {
            slidesPerView: 3,
          },
          900: {
            slidesPerView: 4,
          },
          1200: {
            slidesPerView: 5,
          },
          1600: {
            slidesPerView: 6,
          },
        }}>
        {product.subProducts.map((p, i) => (
          <SwiperSlide key={i}>
            <div className={styles.product_item}>
              <div className={styles.product_item_img}>
                <img src={p.images[0].url} alt="" />
              </div>
              <div className={styles.product_actions}>
                <Link to={`/admin/dashboard/product/${product._id}`}>
                  <TbEdit />
                </Link>
                <Link to={`/product/${product.slug}?style=${i}`}>
                  <AiOutlineEye />
                </Link>
                <Link to="">
                  <RiDeleteBin2Line />
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
