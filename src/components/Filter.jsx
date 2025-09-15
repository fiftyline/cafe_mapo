import React from 'react';
import styles from './Filter.module.css';

const Filter = ({ onFilterClick, appliedFilters, filterConfig }) => {

  const getSelectedValueText = (filter) => {
    const selected = appliedFilters[filter.label];
    if (!selected || selected.length === 0) return '';

    if (filter.type === 'chips') {
      // For '기타' filter, find the label from the options
      return selected.map(dbField => {
        const option = filter.options.find(opt => opt.dbField === dbField);
        return option ? option.label : '';
      }).join(', ');
    } else {
      // For regular filters
      return selected.join(', ');
    }
  };

  return (
    <div className={styles.filterGrid}>
      {filterConfig.map(filter => (
        <div key={filter.id} className={styles.filterOption} onClick={() => onFilterClick(filter)}>
          <img src={filter.icon} alt={filter.label} className={styles.icon} />
          <div className={styles.textContainer}>
            <span className={styles.elementName}>{filter.label}</span>
            <span className={styles.selectedValue}>
              {getSelectedValueText(filter)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Filter;
