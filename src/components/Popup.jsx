import React, { useState, useEffect } from 'react';

const Popup = ({ filter, options, selectedOptions: initialSelected, onClose, onApply }) => {
  const [selectedOptions, setSelectedOptions] = useState(initialSelected);

  useEffect(() => {
    setSelectedOptions(initialSelected);
  }, [initialSelected]);

  const handleOptionClick = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const handleApply = () => {
    onApply(filter, selectedOptions);
  };

  return (
    <div className="popup-overlay" onClick={onClose}> 
      <div className="popup" onClick={(e) => e.stopPropagation()}> 
        <div className="popup-header">{filter}</div>
        <div className="popup-options">
          {options.map((option) => (
            <div
              key={option}
              className={`popup-option ${selectedOptions.includes(option) ? 'selected' : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
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