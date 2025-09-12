import React from 'react';
import styles from './Filter.module.css';

const iconMap = {
  목적: 'purpose.png',
  분위기: 'atmosphere.png',
  웨이팅: 'waiting.png',
  콘센트: 'plug.png',
  의자: 'chair.png',
  테이블: 'table.png',
  소음: 'noise.png',
  조명: 'light.png',
  '좌석 간격': 'distance.png',
  규모: 'size.png',
  음료: 'beverage.png',
  디저트: 'dessert.png',
  '영업마감': 'time.png',
  기타: 'other.png',
};

const FILTERS = [
  '목적', '분위기', '웨이팅', '콘센트',
  '의자', '테이블', '소음', '조명',
  '좌석 간격', '규모', '음료', '디저트',
  '영업마감'
];

const Filter = ({ onFilterClick, appliedFilters }) => {
  return (
    <div className={styles.filterGrid}>
      {FILTERS.map((filter) => (
        <div key={filter} className={styles.filterOption} onClick={() => onFilterClick(filter)}>
          <img src={`/src/assets/${iconMap[filter]}`} alt={filter} className={styles.icon} />
          <div className={styles.textContainer}>
            <span className={styles.elementName}>{filter}</span>
            <span className={styles.selectedValue}>
              {Array.isArray(appliedFilters[filter])
                ? appliedFilters[filter].length > 0
                  ? appliedFilters[filter].join(', ')
                  : ''
                : appliedFilters[filter] === 'O'
                  ? filter
                  : ''}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Filter;
