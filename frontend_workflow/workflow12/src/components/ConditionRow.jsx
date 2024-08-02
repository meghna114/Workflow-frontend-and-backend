import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import "./ConditionRow.css";

const ConditionRow = ({ index, onConditionChange, prefill }) => {
  const [firstDropdown, setFirstDropdown] = useState(prefill?.Action || "");
  const [textBoxValue, setTextBoxValue] = useState(prefill?.Condition || "");
  const [secondDropdown, setSecondDropdown] = useState(prefill?.Activity || "");

  const parameters1 = ["AgeCheck", "GenderCheck", "PincodeCheck"];
  const parameters2 = ["AgeCheck", "GenderCheck", "PincodeCheck", "LoanStatus"];

  const validateTextBoxValue = () => {
    if (firstDropdown === "AgeCheck") {
      return /^age[<>]\d+(\s+or\s+age[<>]\d+)?$/.test(textBoxValue); // e.g., age>25 or age<30
    } else if (firstDropdown === "GenderCheck") {
      return ["male", "female"].includes(textBoxValue.toLowerCase());
    } else if (firstDropdown === "PincodeCheck") {
      return /^\d{6}$/.test(textBoxValue) || /^\d{2}\d*$/.test(textBoxValue);
    }
    return true;
  };

  useEffect(() => {
    if (typeof onConditionChange === 'function') {
      if (validateTextBoxValue()) {
        onConditionChange(index, {
          Action: firstDropdown,
          Condition: textBoxValue,
          Activity: secondDropdown,
        });
      }
    } else {
      console.error('onConditionChange is not a function');
    }
  }, [firstDropdown, textBoxValue, secondDropdown, index, onConditionChange]);

  const getPlaceholder = () => {
    if (firstDropdown === "AgeCheck") return "age>30 or age<45";
    if (firstDropdown === "GenderCheck") return "male or female";
    if (firstDropdown === "PincodeCheck") return "6-digit PIN code";
    return "";
  };

  return (
    <div className="condition-row">
      <select
        value={firstDropdown}
        onChange={(e) => setFirstDropdown(e.target.value)}
      >
        <option value="">Select Parameter</option>
        {parameters1.map((param) => (
          <option key={param} value={param}>
            {param}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={textBoxValue}
        onChange={(e) => setTextBoxValue(e.target.value)}
        placeholder={getPlaceholder()}
      />
      <select
        value={secondDropdown}
        onChange={(e) => setSecondDropdown(e.target.value)}
      >
        <option value="">Select Parameter</option>
        {parameters2.map((param) => (
          <option key={param} value={param}>
            {param}
          </option>
        ))}
      </select>
    </div>
  );
};

// Add PropTypes for validation
ConditionRow.propTypes = {
  index: PropTypes.number.isRequired,
  onConditionChange: PropTypes.func.isRequired,
  prefill: PropTypes.shape({
    Action: PropTypes.string,
    Condition: PropTypes.string,
    Activity: PropTypes.string
  })
};

// Provide default props
ConditionRow.defaultProps = {
  prefill: {
    Action: "",
    Condition: "",
    Activity: ""
  }
};

export default ConditionRow;
