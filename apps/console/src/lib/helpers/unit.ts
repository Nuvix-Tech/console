import { create } from "zustand";

type Unit<T = string> = {
  name: T;
  value: number;
};

type ValueUnitState<T = string> = {
  /**
   * The value of the unit in the selected unit.
   * For example, if the selected unit is "Hours" and the value is 2,
   * it means 2 hours.
   * If the selected unit is "Minutes" and the value is 120,
   * it means 120 minutes.
   * If the selected unit is "Seconds" and the value is 7200,
   * it means 7200 seconds.
   */
  value: number;
  /**
   * The selected unit.
   * For example, "Hours", "Minutes", or "Seconds".
   */
  unit: T;
  baseValue: number;
  setUnit: (newUnit: T) => void;
  setValue: (newValue: number) => void;
  units: Unit<T>[];
};

/**
 * Creates a store for managing value and unit conversions.
 *
 * @template T - The type for unit names, defaults to string
 * @param initialValue - The initial numeric value
 * @param units - Array of units where each unit has a name and a conversion value relative to the base unit
 * @param set - Function to update the store state
 * @param get - Function to retrieve the current store state
 * @returns A ValueUnitState object that includes:
 *   - value: Current numeric value in the selected unit
 *   - unit: Current selected unit name
 *   - baseValue: Current value converted to the base unit (where unit.value = 1)
 *   - setUnit: Function to change the current unit while preserving the actual quantity
 *   - setValue: Function to update the numeric value while maintaining the current unit
 *   - units: Array of available units
 * @throws Error if units array doesn't include a base unit with value of 1
 * @throws Error if any unit has a value less than or equal to 0
 */
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
