import { useState } from 'react';

const useInput = (initialState) => {
  const [inputValues, setInputValues] = useState(initialState);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? (checked ? 1 : 0) : value;

    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [name]: newValue,
    }));
  };

  const reset = (field) => {
    if (field && initialState.hasOwnProperty(field)) {
      setInputValues(prev => ({
        ...prev,
        [field]: initialState[field]
      }));
    } else {
      setInputValues(initialState);
    }
  };


  return {
    inputValues,
    handleChange,
    reset,
  };
};

export default useInput;