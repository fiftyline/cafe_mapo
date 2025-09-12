import React from 'react';
import styles from './Filter.module.css';

const Filter = ({ onFilterClick, appliedFilters, filterConfig, otherFiltersConfig }) => {
  return (
    <div className={styles.filterGrid}>
      {filterConfig.map(filter => (
        <div key={filter.id} className={styles.filterOption} onClick={() => onFilterClick(filter.label)}>
          <img src={filter.icon} alt={filter.label} className={styles.icon} />
          <div className={styles.textContainer}>
            <span className={styles.elementName}>{filter.label}</span>
            <span className={styles.selectedValue}>
              {Array.isArray(appliedFilters[filter.label])
                ? appliedFilters[filter.label].length > 0
                  ? appliedFilters[filter.label].join(', ')
                  : ''
                : appliedFilters[filter.label] === 'O'
                  ? filter.label
                  : ''}
            </span>
          </div>
        </div>
      ))}
      {otherFiltersConfig.map(filter => (
        <div key={filter.id} className={styles.filterOption} onClick={() => onFilterClick(filter.label)}>
          <img src={filter.icon} alt={filter.label} className={styles.icon} />
          <div className={styles.textContainer}>
            <span className={styles.elementName}>{filter.label}</span>
            <span className={styles.selectedValue}>
              {appliedFilters[filter.label] === 'O' ? filter.label : ''}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Filter;