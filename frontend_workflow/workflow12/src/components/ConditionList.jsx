import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConditionRow from "./ConditionRow";
import axios from "axios";

const ConditionList = () => {
  const [rows, setRows] = useState([{}]);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const navigate = useNavigate();

  const addRow = () => {
    setRows((prevRows) => [...prevRows, {}]);
    setError("");
  };

  const handleConditionChange = (index, condition) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows[index] = condition;
      return updatedRows;
    });
  };

  const validateRows = () => {
    return rows.every((row) => {
      if (row.Action === "AgeCheck")
        return /^age[<>]\d+(\s+or\s+age[<>]\d+)?$/.test(row.Condition);
      if (row.Action === "GenderCheck")
        return ["male", "female"].includes(row.Condition.toLowerCase());
      if (row.Action === "PincodeCheck")
        return /^\d{6}$/.test(row.Condition) || /^\d{2}\d*$/.test(row.Condition);
      return false;
    });
  };

  const handleSaveClick = async () => {
    if (validateRows()) {
      const randomstring = (Math.random() + 1).toString(36).substring(7);
      const workflow = {
        name: "test this workflow " + randomstring,
        steps: rows.map((row) => ({
          action: { name: row.Action },
          condition: { conditionText: row.Condition },
          activity: { name: row.Activity },
        })),
      };
      try {
        const response = await axios.post(
          "http://localhost:8080/workflows",
          workflow
        );
        setSaveMessage("Workflow saved successfully!");
      } catch (error) {
        setError("Error saving workflow. Please try again.");
      }
    } else {
      setError("Please fill in all fields correctly before saving.");
    }
  };

  const handleRedirect = () => {
    navigate("/view-workflows");
  };

  return (
    <div className="condition-list-container">
      <h1>Workflow Parameters</h1>
      {rows.map((row, index) => (
        <ConditionRow
          key={index}
          index={index}
          onConditionChange={handleConditionChange} // Ensure this is passed correctly
          prefill={row}
        />
      ))}
      <div>
        <button className="button" onClick={addRow}>
          Add Condition
        </button>
        <button className="button" onClick={handleSaveClick}>
          Save Workflow
        </button>
        <button className="button" onClick={handleRedirect}>
          View Workflows
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {saveMessage && <div className="success-message">{saveMessage}</div>}
    </div>
  );
};

export default ConditionList;
