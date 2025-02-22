import { proxy, useSnapshot } from "valtio";
import { useRef } from "react";

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
};

function createValueUnitStore<T = string>(initialValue: number, units: Unit<T>[]) {
  if (!units.some((u) => u.value === 1)) {
    throw new Error("Units must have a value of 1");
  }
  if (units.some((u) => u.value < 1)) {
    throw new Error("Units must have a value greater than 1");
  }

  const sortedUnits = [...units].sort((a, b) => b.value - a.value);
  const state = proxy<ValueUnitState<T>>({
    value: initialValue,
    unit: sortedUnits[sortedUnits.length - 1].name,
    baseValue: initialValue * sortedUnits[sortedUnits.length - 1].value,
    setUnit(newUnit: T) {
      const prevUnit = units.find((u) => u.name === state.unit);
      const newUnitObj = units.find((u) => u.name === newUnit);
      if (!prevUnit || !newUnitObj) return;

      const unitInBase = state.value * prevUnit.value;
      state.unit = newUnit;
      state.value = unitInBase / newUnitObj.value;
      state.baseValue = unitInBase;
    },
    setValue(newValue: number) {
      state.value = newValue;
      state.baseValue = newValue * (units.find((u) => u.name === state.unit)?.value || 1);
    },
  });

  return { state, units };
}

function useValueUnitPair<T = string>(initialValue: number, units: Unit<T>[]) {
  const storeRef = useRef(createValueUnitStore(initialValue, units));
  const snap = useSnapshot(storeRef.current.state);
  return { ...snap, ...storeRef.current };
}

function useTimeUnitPair(initialValue = 0) {
  const units: Unit[] = [
    { name: "Days", value: 86400 },
    { name: "Hours", value: 3600 },
    { name: "Minutes", value: 60 },
    { name: "Seconds", value: 1 },
  ];
  return useValueUnitPair(initialValue, units);
}

function useByteUnitPair(initialValue = 0, base: 1000 | 1024 = 1000) {
  const units: Unit[] = [
    { name: "Bytes", value: 1 },
    { name: "Kilobytes", value: base },
    { name: "Megabytes", value: base ** 2 },
    { name: "Gigabytes", value: base ** 3 },
  ];
  return useValueUnitPair(initialValue, units);
}

export { useValueUnitPair, useTimeUnitPair, useByteUnitPair };

export type { Unit };
