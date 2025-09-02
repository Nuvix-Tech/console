import { proxy, useSnapshot } from "valtio";
import { useEffect, useMemo, useRef } from "react";

type Unit<T = string> = {
  name: T;
  value: number;
};

type ValueUnitState<T = string> = {
  value: number;
  unit: T;
  baseValue: number;
  setUnit: (newUnit: T) => void;
  setValue: (newValue: number) => void;
  units: Unit<T>[];
};

function createValueUnitState<T = string>(
  initialValue: number,
  units: Unit<T>[],
): ValueUnitState<T> {
  if (!units.some((u) => u.value === 1)) {
    throw new Error("Units must include a base unit with value of 1");
  }

  if (units.some((u) => u.value <= 0)) {
    throw new Error("Units must have a value greater than 0");
  }

  const sortedUnits = [...units].sort((a, b) => b.value - a.value);

  // Find the most suitable unit - largest unit where the value is a whole number or >= 1
  let initialUnit = sortedUnits.find((unit) => {
    const convertedValue = initialValue / unit.value;
    return convertedValue >= 1 && convertedValue === Math.floor(convertedValue);
  });

  // If no perfect match found, use the largest unit where converted value >= 1
  if (!initialUnit) {
    initialUnit = sortedUnits.find((unit) => initialValue / unit.value >= 1);
  }

  // Fallback to smallest unit if still no match
  if (!initialUnit) {
    initialUnit = sortedUnits[sortedUnits.length - 1];
  }

  const state = proxy<ValueUnitState<T>>({
    value: initialValue / initialUnit.value,
    unit: initialUnit.name,
    baseValue: initialValue,
    units: sortedUnits,

    setUnit(newUnit: T) {
      const newUnitObj = state.units.find((u) => u.name === newUnit);
      if (!newUnitObj) return;

      state.value = state.baseValue / newUnitObj.value;
      state.unit = newUnitObj.name;
    },

    setValue(newValue: number) {
      const currentUnit = state.units.find((u) => u.name === state.unit);
      if (!currentUnit) return;

      state.value = newValue;
      state.baseValue = newValue * currentUnit.value;
    },
  });

  return state;
}

function useValueUnitPair<T = string>(externalBaseValue: number, units: Unit<T>[]) {
  const stateRef = useRef(createValueUnitState(externalBaseValue, units));
  const state = stateRef.current;
  const snapshot = useSnapshot(state);

  useEffect(() => {
    const currentUnit = state.units.find((u) => u.name === state.unit);
    if (currentUnit && state.baseValue !== externalBaseValue) {
      state.baseValue = externalBaseValue;
      state.value = externalBaseValue / currentUnit.value;
    }
  }, [externalBaseValue]);

  return {
    value: snapshot.value,
    unit: snapshot.unit,
    baseValue: snapshot.baseValue,
    units: snapshot.units,
    setUnit: state.setUnit,
    setValue: state.setValue,
  };
}

export function useTimeUnitPair(externalBaseValue: number = 0) {
  const units: Unit<string>[] = [
    { name: "Seconds", value: 1 },
    { name: "Minutes", value: 60 },
    { name: "Hours", value: 3600 },
    { name: "Days", value: 86400 },
  ];

  return useValueUnitPair(externalBaseValue, units);
}

export function useByteUnitPair(externalBaseValue: number = 0, base: 1000 | 1024 = 1000) {
  const units: Unit<string>[] = [
    { name: "Bytes", value: 1 },
    { name: "Kilobytes", value: base },
    { name: "Megabytes", value: base ** 2 },
    { name: "Gigabytes", value: base ** 3 },
  ];

  return useValueUnitPair(externalBaseValue, units);
}
