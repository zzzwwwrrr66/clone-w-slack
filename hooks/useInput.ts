import React, { useState, useCallback } from 'react';

export default (inputValue: any = null)=> {
  const [value, setValue] = useState(inputValue);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, [])

  return [value, onChange, setValue]
}
