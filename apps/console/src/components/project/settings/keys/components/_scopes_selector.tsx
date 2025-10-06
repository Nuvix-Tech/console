import { FieldWrapper } from "@/components/others/forms";
import { scopes } from "@/lib/constants";
import { Accordion, Button, Checkbox, Tag, Text } from "@nuvix/ui/components";
import { useFormikContext } from "formik";
import React, { useMemo } from "react";

export const ScopesSelector = () => {
  const { values, setFieldValue, setFieldTouched } = useFormikContext<{ scopes: string[] }>();

  // Filter valid scopes once
  const filteredScopes = useMemo(() => scopes.filter(({ scope }) => !!scope), []);

  enum Category {
    Auth = "Auth",
    Database = "Database",
    Messaging = "Messaging",
    Storage = "Storage",
    Other = "Other",
  }

  const categories = Object.values(Category);

  const isScopeSelected = (scope: string) => values.scopes.includes(scope);

  const onToggleScope = (scope: string) => {
    const updated = isScopeSelected(scope)
      ? values.scopes.filter((s) => s !== scope)
      : [...values.scopes, scope];
    setFieldTouched("scopes", true);
    setFieldValue("scopes", updated.sort());
  };

  const selectedCategoryScopes = (cat: Category) =>
    filteredScopes.filter((i) => i.category === cat);

  const getSelectionStats = (cat: Category) => {
    const catScopes = selectedCategoryScopes(cat);
    const selectedCount = catScopes.filter((i) => isScopeSelected(i.scope)).length;
    const totalCount = catScopes.length;

    return {
      selectedCount,
      totalCount,
      allSelected: selectedCount === totalCount && totalCount > 0,
      noneSelected: selectedCount === 0,
      partiallySelected: selectedCount > 0 && selectedCount < totalCount,
    };
  };

  const toggleAllInCategory = (cat: Category) => {
    const catScopes = selectedCategoryScopes(cat);
    const { allSelected } = getSelectionStats(cat);

    let updated: string[];
    if (allSelected) {
      // Deselect all
      updated = values.scopes.filter((scope) => !catScopes.some((i) => i.scope === scope));
    } else {
      // Select all missing
      const newScopes = catScopes.map((i) => i.scope);
      updated = Array.from(new Set([...values.scopes, ...newScopes])).sort();
    }
    setFieldTouched("scopes", true);
    setFieldValue("scopes", updated);
  };

  const totalScopes = filteredScopes.length;

  return (
    <FieldWrapper
      name="scopes"
      label="Scopes"
      description="Choose which permission scopes to grant your application. It is best practice to allow only the permissions you need to meet your project goals."
      layout="horizontal"
    >
      <div className="flex flex-col gap-4">
        {/* Global Header */}
        <div className="flex gap-3 items-center">
          <Button
            size="s"
            variant="tertiary"
            onClick={() => setFieldValue("scopes", filteredScopes.map((s) => s.scope).sort())}
            disabled={values.scopes.length === totalScopes}
          >
            Select All
          </Button>
          <div className="w-px h-6 neutral-background-alpha-medium" />
          <Button
            size="s"
            variant="tertiary"
            onClick={() => setFieldValue("scopes", [])}
            disabled={values.scopes.length === 0}
          >
            Deselect All
          </Button>
        </div>

        {/* Categories */}
        <div className="neutral-background-alpha-weak radius-s overflow-hidden">
          {categories.map((category) => {
            const categoryScopes = selectedCategoryScopes(category);
            if (categoryScopes.length === 0) return null;

            const { selectedCount, totalCount, allSelected, partiallySelected } =
              getSelectionStats(category);

            return (
              <Accordion
                key={category}
                title={
                  <div className="flex items-center justify-between w-full gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        label={<Text variant="label-strong-s">{category}</Text>}
                        isChecked={allSelected}
                        isIndeterminate={partiallySelected}
                        onToggle={() => toggleAllInCategory(category)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <Tag variant={selectedCount > 0 ? "gradient" : "neutral"}>
                      {selectedCount}/{totalCount}
                    </Tag>
                  </div>
                }
                headingProps={{
                  variant: "label-strong-s",
                }}
                gap="4"
              >
                <div className="flex flex-col gap-4 ml-8">
                  {categoryScopes.map((item) => (
                    <Checkbox
                      key={item.scope}
                      label={item.scope}
                      description={item.description}
                      isChecked={isScopeSelected(item.scope)}
                      onToggle={() => onToggleScope(item.scope)}
                    />
                  ))}
                </div>
              </Accordion>
            );
          })}
        </div>
      </div>
    </FieldWrapper>
  );
};
