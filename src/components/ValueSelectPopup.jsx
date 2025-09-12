
// src/components/ValueSelectPopup.jsx
import React, { useState } from 'react';
import styles from './ValueSelectPopup.module.css';

// ///////////////////////////////////
// ValueSelectPopup.jsx: 필터 값 선택 팝업
// - 개별 필터 항목의 값들을 보여주고 선택하게 함
// ///////////////////////////////////
const ValueSelectPopup = ({ filter, selectedValue, onSelect, onClose }) => {
  const [currentValue, setCurrentValue] = useState(selectedValue);

  const handleApply = () => {
    onSelect(currentValue);
    onClose();
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.popup} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h4>{filter.label}</h4>
        </div>
        <div className={styles.optionsContainer}>
          {filter.options.map(option => (
            <button 
              key={option}
              className={`${styles.optionButton} ${currentValue === option ? styles.selected : ''}`}
              onClick={() => setCurrentValue(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <div className={styles.footer}>
            <button className={styles.applyButton} onClick={handleApply}>적용하기</button>
        </div>
      </div>
    </div>
  );
};

export default ValueSelectPopup;
