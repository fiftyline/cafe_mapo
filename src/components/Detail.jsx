import React from 'react';
import styles from './Detail.module.css';
import { otherFiltersConfig } from '../services/filterConfig';

const Detail = ({ cafe }) => {
  if (!cafe) return null;

  const featureOrder = [
    '추천메뉴', '목적', '분위기', '웨이팅', '콘센트', '의자', '테이블', '소음', '조명', '좌석 간격', '규모', '음료', '디저트', '영업마감'
  ];

  const otherFeatures = otherFiltersConfig.map(f => f.label);

  const renderFeature = (key, value) => {
    if (!value || value === '정보없음' || value === '정보부족') return null;

    let displayValue = value;
    if (value === 'O') displayValue = '있음';
    if (value === 'X') displayValue = '없음';

    return (
      <div key={key} className={styles.detailItem}>
        <span className={styles.detailItemKey}>{key}</span>
        <span className={styles.detailItemValue}>{displayValue}</span>
      </div>
    );
  };

  return (
    <div className={styles.detailScreen}>
      <div className={styles.detailImage}></div>
      <div className={styles.detailContent}>
        <div className={styles.detailSectionTitle}>카페 특징</div>
        <div className={styles.detailGrid}>
          {featureOrder.map(feature => (
            cafe[feature] ? renderFeature(feature, cafe[feature]) : null
          ))}
          {otherFeatures.map(feature => (
            cafe[feature] === 'O' ? renderFeature(feature, cafe[feature]) : null
          ))}
        </div>
      </div>
    </div>
  );
};

export default Detail;