import React from 'react';

const DateFilters = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  return (
    <div className="date-filters">
      <label>
        Date: 
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
        />
      </label>
      <label>   
        -
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
        />
      </label>
    </div>
  );
};

export default DateFilters;
