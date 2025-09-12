
// src/components/CafeCard.jsx
import React from 'react';
import styles from './CafeCard.module.css';

// ///////////////////////////////////
// CafeCard.jsx: 개별 카페 정보 카드
// - cafe 객체를 props로 받아 UI를 렌더링
// ///////////////////////////////////
const CafeCard = ({ cafe, onClick }) => {
  // 대표적인 특징 2-3개를 태그로 보여주기 위한 간단한 로직
  const tags = [];
  if (cafe.콘센트 === '많음') tags.push('#콘센트 많음');
  if (cafe.의자 === '편함') tags.push('#편한 의자');
  if (cafe.소음 === '조용함') tags.push('#조용한');
  if (cafe.목적 === '카공/작업') tags.push('#작업하기 좋은');

  return (
    <div className={styles.card} onClick={() => onClick(cafe)}>
      <div className={styles.imagePlaceholder}></div>
      <div className={styles.content}>
        <h3 className={styles.title}>{cafe.base}</h3>
        <p className={styles.location}>{cafe.location || '위치 정보 없음'}</p>
        <div className={styles.tags}>
          {tags.slice(0, 3).map(tag => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CafeCard;
