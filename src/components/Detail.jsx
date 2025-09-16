import React, { useState, useEffect } from 'react';
import supabase from '../services/supabaseClient';
import styles from './Detail.module.css';
import { filterConfig } from '../services/filterConfig';
import ImageCarouselModal from './ImageCarouselModal';
import navermapIcon from '../assets/navermap.png';
import kakaomapIcon from '../assets/kakaomap.png';

const Detail = ({ cafe }) => {
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!cafe) return;

    const fetchImages = async () => {
      const { data, error } = await supabase.rpc('get_images_for_base', { base_name: cafe.base });

      if (error) {
        console.error('Error fetching detail images:', error);
      } else {
        setImages(data);
      }
    };

    fetchImages();
  }, [cafe]);

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!cafe) return null;

  // Find the '기타' config and build the feature string
  const otherFilterConfig = filterConfig.find(f => f.id === 'other');
  const otherFeatureLabels = [];
  if (otherFilterConfig) {
    otherFilterConfig.options.forEach(option => {
      if (cafe[option.dbField] === 'O') {
        otherFeatureLabels.push(option.label);
      }
    });
  }

  const renderFeature = (key, value, className) => {
    if (!value || value.length === 0 || value === '정보없음' || value === '정보부족') return null;

    let displayValue = Array.isArray(value) ? value.join(', ') : value;
    if (displayValue === 'O') displayValue = '있음';
    if (displayValue === 'X') displayValue = '없음';
    if (displayValue.trim() === '') return null;

    return (
      <div className={`${styles.featureItem} ${className}`}>
        <span className={styles.detailItemKey}>{key}</span>
        <span className={styles.detailItemValue}>{displayValue}</span>
      </div>
    );
  };

  return (
    <>
      <div className={styles.detailScreen}>
        <div className={styles.imageGrid}>
          {images.map((image, index) => (
            <div
              key={index}
              className={styles.detailImage}
              style={{ backgroundImage: `url(${image.og_image_url})` }}
              onClick={() => handleImageClick(index)}
            ></div>
          ))}
        </div>
        <div className={styles.detailContent}>
          <div className={styles.detailSectionTitle}>
            <span>카페 특징</span>
            <div className={styles.mapIcons}>
              <a href={cafe.navermap_url} target="_blank" rel="noopener noreferrer">
                <img src={navermapIcon} alt="Naver Map" className={styles.mapIcon} />
              </a>
              <a href={cafe.kakaomap_url} target="_blank" rel="noopener noreferrer">
                <img src={kakaomapIcon} alt="Kakao Map" className={styles.mapIcon} />
              </a>
            </div>
          </div>
          <div className={styles.featureGrid}>
            {renderFeature('추천메뉴', cafe['추천메뉴'], styles.colSpan6)}
            {renderFeature('목적', cafe['목적'], styles.colSpan2)}
            {renderFeature('분위기', cafe['분위기'], styles.colSpan2)}
            {renderFeature('웨이팅', cafe['웨이팅'], styles.colSpan2)}
            {renderFeature('의자', cafe['의자'], styles.colSpan2)}
            {renderFeature('테이블', cafe['테이블'], styles.colSpan2)}
            {renderFeature('콘센트', cafe['콘센트'], styles.colSpan2)}
            {renderFeature('소음', cafe['소음'], styles.colSpan3)}
            {renderFeature('조명', cafe['조명'], styles.colSpan3)}
            {renderFeature('좌석 간격', cafe['좌석 간격'], styles.colSpan3)}
            {renderFeature('규모', cafe['규모'], styles.colSpan3)}
            {renderFeature('음료', cafe['음료'], styles.colSpan3)}
            {renderFeature('디저트', cafe['디저트'], styles.colSpan3)}
            {renderFeature('영업마감', cafe['영업마감'], styles.colSpan3)}
            {renderFeature('기타', otherFeatureLabels, styles.colSpan3)}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <ImageCarouselModal
          images={images}
          startIndex={currentImageIndex}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default Detail;
