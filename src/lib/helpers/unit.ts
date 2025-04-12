import { create } from "zustand";

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

function createValueUnitStore<T = string>(
  initialValue: number,
  units: Unit<T>[],
  set: (arg0: Partial<ValueUnitState<T>>) => void,
  get: () => ValueUnitState<T>,
) {
  if (!units.some((u) => u.value === 1)) {
    throw new Error("Units must include a base unit with value of 1");
  }
  if (units.some((u) => u.value <= 0)) {
    throw new Error("Units must have a value greater than 0");
  }

  const sortedUnits = [...units].sort((a, b) => b.value - a.value);
  const state: ValueUnitState<T> = {
    value: initialValue,
    unit: sortedUnits[sortedUnits.length - 1].name,
    baseValue: initialValue * sortedUnits[sortedUnits.length - 1].value,
    setUnit(newUnit: T) {
      const prevUnit = units.find((u) => u.name === get().unit);
      const newUnitObj = units.find((u) => u.name === newUnit);
      if (!prevUnit || !newUnitObj) return;

      const unitInBase = get().value * prevUnit.value;
      set({
        unit: newUnit,
        value: unitInBase / newUnitObj.value,
        baseValue: unitInBase,
      });
    },
    setValue(newValue: number) {
      set({
        value: newValue,
        baseValue: newValue * (units.find((u) => u.name === get().unit)?.value || 1),
      });
    },
    units,
  };

  return { ...state, units };
}

function useValueUnitPair<T = string>(initialValue: number | null | undefined, units: Unit<T>[]) {
  const safeInitialValue = initialValue ?? 0;
  const useStore = create<ValueUnitState<T>>((set, get) =>
    createValueUnitStore(safeInitialValue, units, set, get),
  );
  const state = useStore();
  return { ...state };
}

function useTimeUnitPair(initialValue: number | null | undefined = 0) {
  const units: Unit[] = [
    { name: "Days", value: 86400 },
    { name: "Hours", value: 3600 },
    { name: "Minutes", value: 60 },
    { name: "Seconds", value: 1 },
  ];
  return useValueUnitPair(initialValue ?? 0, units);
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
