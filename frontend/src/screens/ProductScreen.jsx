import { useLocation, useParams } from 'react-router-dom';
import styles from './../styles/product.module.scss';
import { useGetOneBySlugQuery } from '../store/services/productService';
import Header from '../components/header';
import { useState } from 'react';
import MainSwiper from '../components/productPage/mainSwiper/index';
import Infos from '../components/productPage/infos/index';
import DotLoaderSpinner from '../components/loaders';

export default function ProductScreen({ country }) {
  const [activeImg, setActiveImg] = useState('');
  const { slug } = useParams();
  const { search } = useLocation();

  const params = new URLSearchParams(search);
  const style = params.get('style');
  const size = params.get('size') ? params.get('size') : 0;

  const { data, isFetching, isError } = useGetOneBySlugQuery({
    slug: slug,
    style: style,
    size: size,
  });

  // console.log(data, isFetching);

  const product = data?.data ? data?.data : {};

  return (
    <>
      <Header country={country} />
      {isFetching ? (
        <DotLoaderSpinner />
      ) : isError ? (
        <div>Error occurred while fetching data.</div>
      ) : (
        <div className={styles.product}>
          <div className={styles.product_container}>
            <div className={styles.path}>Home / {product.category_name}</div>
            <div className={styles.product_main}>
              <MainSwiper images={product.images} activeImg={activeImg} />
              <Infos product={product} setActiveImg={setActiveImg} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
