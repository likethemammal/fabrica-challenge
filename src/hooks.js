import { useEffect, useState } from "react";

export const useChangedAfterInitial = (value) => {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);

  useEffect(increment, [value]);

  const changed = count > 1;

  return changed;
};

export const useOnChangeAfterInitial = (value, onChange) => {
  const changed = useChangedAfterInitial(value);

  useEffect(() => {
    if (!changed) {
      return;
    }

    console.log("changed");

    onChange();
  }, [changed, value]);
};
