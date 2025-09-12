
// src/components/FilterModal.jsx
import React, { useState } from 'react';
import styles from './FilterModal.module.css';
import { filterConfig, otherFiltersConfig } from '../services/filterConfig';
import ValueSelectPopup from './ValueSelectPopup'; // 다음 단계에서 생성할 컴포넌트

// ///////////////////////////////////
// FilterModal.jsx: 필터 선택 모달
// - 필터링 옵션들을 표시하고 사용자 선택을 관리
// - 최종 필터 값을 App.jsx로 전달
// ///////////////////////////////////
const FilterModal = ({ currentFilters, onApply, onClose }) => {
  const [localFilters, setLocalFilters] = useState(currentFilters);
  const [popupFilter, setPopupFilter] = useState(null); // 현재 열려있는 팝업의 필터 정보

  // 필터 값 변경 핸들러 (ValueSelectPopup에서 사용)
  const handleFilterChange = (filterId, value) => {
    setLocalFilters(prev => ({ ...prev, [filterId]: value }));
  };

  // '기타' 필터 토글 핸들러
  const handleOtherFilterToggle = (dbField) => {
    setLocalFilters(prev => ({
      ...prev,
      [dbField]: prev[dbField] === 'O' ? undefined : 'O',
    }));
  };

  const handleReset = () => {
    setLocalFilters({});
  };

  const handleApply = () => {
    onApply(localFilters);
  };

  const openPopup = (filter) => {
    setPopupFilter(filter);
  };

  const closePopup = () => {
    setPopupFilter(null);
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>필터</h3>
        </div>

        <div className={styles.filterGrid}>
          {filterConfig.map(filter => (
            <div key={filter.id} className={styles.filterOption} onClick={() => openPopup(filter)}>
              <img src={filter.icon} alt={filter.label} className={styles.icon} />
              <div className={styles.textContainer}>
                <span className={styles.elementName}>{filter.label}</span>
                <span className={styles.selectedValue}>{localFilters[filter.dbField] || '선택 안함'}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.otherFilters}>
            <h4>기타</h4>
            <div className={styles.otherFilterButtons}>
                {otherFiltersConfig.map(filter => (
                    <button 
                        key={filter.id} 
                        className={`${styles.otherButton} ${localFilters[filter.dbField] === 'O' ? styles.selected : ''}`}
                        onClick={() => handleOtherFilterToggle(filter.dbField)}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.resetButton} onClick={handleReset}>초기화</button>
          <button className={styles.applyButton} onClick={handleApply}>적용하기</button>
        </div>

        {popupFilter && (
          <ValueSelectPopup 
            filter={popupFilter} 
            selectedValue={localFilters[popupFilter.dbField]} 
            onSelect={(value) => handleFilterChange(popupFilter.dbField, value)}
            onClose={closePopup} 
          />
        )}
      </div>
    </div>
  );
};

export default FilterModal;
