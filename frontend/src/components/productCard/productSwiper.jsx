import styles from './styles.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import { useEffect, useRef } from 'react';

export default function ProductSwiper({ images }) {
  const swiperRef = useRef(null);
  useEffect(() => {
    swiperRef.current.swiper.autoplay.stop();
  }, [swiperRef]);
  return (
    <div
      className={styles.swiper}
      onMouseEnter={() => {
        swiperRef.current.swiper.autoplay.start();
      }}
      onMouseLeave={() => {
        swiperRef.current.swiper.autoplay.stop();
        swiperRef.current.swiper.slideTo(0);
      }}
    >
      <Swiper
        ref={swiperRef}
        centeredSlides={true}
        autoplay={{ delay: 1000, stopOnLastSlide: false }}
        modules={[Autoplay]}
      >
        {images.map((image) => (
          <SwiperSlide key={image.public_url}>
            <img src={image.url} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
