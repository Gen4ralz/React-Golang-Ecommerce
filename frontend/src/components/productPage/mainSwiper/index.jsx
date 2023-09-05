import { useState } from 'react';
import styles from './styles.module.scss';
import ReactImageMagnify from 'react-image-magnify';

export default function MainSwiper({ images, activeImg }) {
  const [active, setActive] = useState(0);
  return (
    <div className={styles.swiper}>
      <div className={styles.swiper_active}>
        <ReactImageMagnify
          {...{
            smallImage: {
              alt: '',
              isFluidWidth: true,
              src: activeImg || images[active].url,
            },
            largeImage: {
              src: activeImg || images[active].url,
              width: 1500,
              height: 2000,
            },
            enlargedImageContainerDimensions: {
              width: '200%',
              height: '100%',
            },
          }}
        />
      </div>
      <div className={styles.swiper_list}>
        {images.map((img, index) => (
          <div
            key={index}
            className={`${styles.swiper_list_item} ${
              index == active && styles.active
            }`}
            onMouseOver={() => setActive(index)}
          >
            <img src={img.url} alt="" key={index} />
          </div>
        ))}
      </div>
    </div>
  );
}
