import React, { useState, useEffect } from 'react';

const Popup = ({ filter, selectedOptions: initialSelected, onClose, onApply }) => {
  const [selectedOptions, setSelectedOptions] = useState(initialSelected);

  useEffect(() => {
    setSelectedOptions(initialSelected);
  }, [initialSelected]);

  const handleOptionClick = (optionValue) => {
    setSelectedOptions((prev) =>
      prev.includes(optionValue) ? prev.filter((o) => o !== optionValue) : [...prev, optionValue]
    );
  };

  const handleApply = () => {
    onApply(filter.label, selectedOptions);
  };

  const renderOptions = () => {
    if (filter.type === 'chips') {
      return filter.options.map((option) => (
        <div
          key={option.dbField}
          className={`popup-option ${selectedOptions.includes(option.dbField) ? 'selected' : ''}`}
          onClick={() => handleOptionClick(option.dbField)}
        >
          {option.label}
        </div>
      ));
    } else {
      return filter.options.map((option) => (
        <div
          key={option}
          className={`popup-option ${selectedOptions.includes(option) ? 'selected' : ''}`}
          onClick={() => handleOptionClick(option)}
        >
          {option}
        </div>
      ));
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}> 
      <div className="popup" onClick={(e) => e.stopPropagation()}> 
        <div className="popup-header">{filter.label}</div>
        <div className="popup-options">
          {renderOptions()}
        </div>
        <div className="popup-actions">
          <button className="filter-action-button reset-button" onClick={() => setSelectedOptions([])}>초기화</button>
          <button className="filter-action-button apply-button" onClick={handleApply}>적용하기</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
