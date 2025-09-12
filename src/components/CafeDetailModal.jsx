
// src/components/CafeDetailModal.jsx
import React from 'react';
import styles from './CafeDetailModal.module.css';

// ///////////////////////////////////
// CafeDetailModal.jsx: 카페 상세 정보 모달
// - 선택된 cafe 객체의 모든 정보를 표시
// ///////////////////////////////////
const CafeDetailModal = ({ cafe, onClose }) => {
  if (!cafe) return null;

  // cafe 객체의 모든 키-값 쌍을 리스트로 보여주기 위한 함수
  const renderDetailItem = (key, value) => {
    if (!value || value === '정보없음' || value === '정보부족') return null;

    let displayValue = value;
    if (value === 'O') displayValue = '있음';
    if (value === 'X') displayValue = '없음';

    return (
      <li key={key} className={styles.detailItem}>
        <span className={styles.detailKey}>{key}</span>
        <span className={styles.detailValue}>{displayValue}</span>
      </li>
    );
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{cafe.base}</h2>
          <button onClick={onClose} className={styles.closeButton}>X</button>
        </div>
        <div className={styles.content}>
          <div className={styles.imagePlaceholder}></div>
          <ul className={styles.detailList}>
            {Object.entries(cafe).map(([key, value]) => renderDetailItem(key, value))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CafeDetailModal;
