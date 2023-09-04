// import { useMediaQuery } from 'react-responsive';
import Footer from '../components/footer';
import Header from '../components/header';
import styles from '../styles/Home.module.scss';
import { useGetQuery } from '../store/services/productService';
import DotLoaderSpinner from '../components/loaders';
import ProductCard from '../components/productCard';

export default function HomeScreen({ country }) {
  //   const isMedium = useMediaQuery({ query: '(max-width:850px)' });
  //   const isMobile = useMediaQuery({ query: '(max-width:550px)' });

  const { data, isFetching, isError } = useGetQuery();
  const products = data?.data ? data?.data : {};

  return (
    <>
      <Header country={country} />
      <div className={styles.home}>
        <div className={styles.container}>
          <div className={styles.products}>
            {isFetching ? (
              <DotLoaderSpinner />
            ) : isError ? (
              <div>Error occurred while fetching data.</div>
            ) : (
              products.map((product) => (
                <ProductCard product={product} key={product._id} />
              ))
            )}
          </div>
        </div>
      </div>
      <Footer country={country} />
    </>
  );
}
