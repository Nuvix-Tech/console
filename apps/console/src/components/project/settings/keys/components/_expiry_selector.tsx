import { FieldWrapper } from "@/components/others/forms";
import { DateInput, Select, Text } from "@nuvix/ui/components";
import { useFormikContext } from "formik";
import React, { useMemo } from "react";
import { addDays, format } from "date-fns";

export const ExpirySelector = () => {
  const { values, setFieldValue } = useFormikContext<{ expire: Date | null }>();

  // Define options
  const options = [
    { label: "Never", value: "never" },
    { label: "7 Days", value: "7d" },
    { label: "30 Days", value: "30d" },
    { label: "90 Days", value: "90d" },
    { label: "Custom", value: "custom" },
  ];

  // Determine which option is currently selected
  const selectedOption = useMemo(() => {
    if (!values.expire) return "never";

    const now = new Date();
    const diffDays = Math.round((values.expire.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (Math.abs(diffDays - 7) <= 1) return "7d";
    if (Math.abs(diffDays - 30) <= 1) return "30d";
    if (Math.abs(diffDays - 90) <= 1) return "90d";
    return "custom";
  }, [values.expire]);

  // Compute expiration description
  const expirationDescription = useMemo(() => {
    if (selectedOption === "never") return "This key will never expire.";
    if (selectedOption === "7d" && values.expire)
      return `Expires on ${format(values.expire, "PPP")}`;
    if (selectedOption === "30d" && values.expire)
      return `Expires on ${format(values.expire, "PPP")}`;
    if (selectedOption === "90d" && values.expire)
      return `Expires on ${format(values.expire, "PPP")}`;
    if (selectedOption === "custom" && values.expire)
      return `Custom expiry: ${format(values.expire, "PPP")}`;
    return undefined;
  }, [selectedOption, values.expire]);

  // Handle selection change
  const handleSelect = (val: string) => {
    const now = new Date();

    switch (val) {
      case "never":
        setFieldValue("expire", null);
        break;
      case "7d":
        setFieldValue("expire", addDays(now, 7));
        break;
      case "30d":
        setFieldValue("expire", addDays(now, 30));
        break;
      case "90d":
        setFieldValue("expire", addDays(now, 90));
        break;
      case "custom":
        // Leave as-is, show date picker
        if (values.expire) setFieldValue("expire", now);
        break;
    }
  };

  return (
    <FieldWrapper
      name="expire"
      label="Expiration Date"
      description={
        expirationDescription ??
        "Select how long this key remains valid. Choose 'Custom' to set a specific date."
      }
      layout="horizontal"
    >
      <div className="flex flex-col gap-3">
        {/* Expiry preset select */}
        <Select
          id="expire-select"
          name="expire-select"
          labelAsPlaceholder
          placeholder="Select expiration period"
          options={options}
          value={selectedOption}
          onSelect={handleSelect}
          portal={false}
        />

        {/* Custom date picker only if 'custom' is selected */}
        {selectedOption === "custom" && (
          <div className="ml-1">
            <DateInput
              id="expire"
              name="expire"
              placeholder="Select custom expiration date"
              value={values.expire ?? undefined}
              onChange={(date) => setFieldValue("expire", date)}
              labelAsPlaceholder
              portal={false}
            />
          </div>
        )}
      </div>
    </FieldWrapper>
  );
};
