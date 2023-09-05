import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';
import ProductSwiper from './productSwiper';

export default function ProductCard({ product }) {
  const [active, setActive] = useState(0);
  const [images, setImages] = useState(product?.subProducts[active]?.images);
  const [prices, setPrices] = useState(
    product?.subProducts[active]?.sizes
      .map((x) => {
        return x.price;
      })
      .sort((a, b) => {
        return a - b;
      })
  );
  const [styless] = useState(
    product.subProducts.map((p) => {
      return p.colors;
    })
  );

  useEffect(() => {
    setImages(product.subProducts[active].images);
    setPrices(
      product.subProducts[active]?.sizes
        .map((x) => {
          return x.price;
        })
        .sort((a, b) => {
          return a - b;
        })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
  return (
    <div className={styles.product}>
      <div className={styles.product_container}>
        <Link to={`/product/${product.slug}?style=${active}`}>
          <div>
            <ProductSwiper images={images} />
          </div>
        </Link>
        {product.subProducts[active].discount ? (
          <div className={styles.product_discount}>
            -{product.subProducts[active].discount}%
          </div>
        ) : (
          ''
        )}
        <div className={styles.product_infos}>
          <h1>
            {product.name.length > 45
              ? `${product.name.substring(0, 45)}...`
              : product.name}
          </h1>
          <span>{prices[0]} THB</span>
          <div className={styles.product_colors}>
            {styless &&
              styless.map((style, i) =>
                style.image ? (
                  <img
                    key={style.color}
                    src={style.image}
                    className={i == active ? styles.active : undefined}
                    alt=""
                    onMouseOver={() => {
                      setImages(product.subProducts[i].images);
                      setActive(i);
                    }}
                  />
                ) : (
                  <span
                    key={style.color}
                    style={{ backgroundColor: `${style.color}` }}
                    onMouseOver={() => {
                      setImages(product.subProducts[i].images);
                      setActive(i);
                    }}
                  ></span>
                )
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
