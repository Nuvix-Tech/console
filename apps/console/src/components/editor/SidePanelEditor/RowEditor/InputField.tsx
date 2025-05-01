import { includes, noop } from "lodash";
import { Edit, Edit2, Eye } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@nuvix/sui/components";
import { Button, Input, Select as Select_UI } from "@nuvix/ui/components";
// import { FormItemLayout } from "ui-patterns/form/FormItemLayout/FormItemLayout";
import { DATETIME_TYPES, JSON_TYPES, TEXT_TYPES } from "../SidePanelEditor.constants";
import { DateTimeInput } from "./DateTimeInput";
import type { EditValue, RowField } from "./RowEditor.types";
import { isValueTruncated } from "./RowEditor.utils";
import { Textarea } from "@nuvix/ui/components";

export interface InputFieldProps {
  field: RowField;
  errors: any;
  isEditable?: boolean;
  onUpdateField?: (changes: object) => void;
  onEditJson?: (data: any) => void;
  onEditText?: (data: EditValue) => void;
  onSelectForeignKey?: () => void;
}

const InputField = ({
  field,
  errors,
  isEditable = true,
  onUpdateField = noop,
  onEditJson = noop,
  onEditText = noop,
  onSelectForeignKey = noop,
}: InputFieldProps) => {
  if (field.enums.length > 0) {
    const isArray = field.format[0] === "_";
    if (isArray) {
      return (
        <div className="text-area-text-sm">
          <Textarea
            data-testid={`${field.name}-input`}
            // layout="horizontal"
            label={field.name}
            className="text-sm"
            description={field.comment}
            // labelOptional={field.format}
            disabled={!isEditable}
            error={!!errors[field.name]}
            errorMessage={errors[field.name]}
            rows={5}
            value={field.value ?? ""}
            placeholder={
              field.defaultValue === null
                ? ""
                : typeof field.defaultValue === "string" && field.defaultValue.length === 0
                  ? "EMPTY"
                  : `Default: ${field.defaultValue}`
            }
            onChange={(event: any) => onUpdateField({ [field.name]: event.target.value })}
          />
        </div>
      );
    } else {
      return (
        <Select_UI
          // size="md"
          // layout="horizontal"
          value={field.value ?? ""}
          label={field.name}
          labelOptional={field.format}
          description={field.comment}
          disabled={!isEditable}
          error={!!errors[field.name]}
          errorMessage={errors[field.name]}
          onChange={(event: any) => onUpdateField({ [field.name]: event.target.value })}
          options={[
            { value: "", label: "---" },
            ...field.enums.map((value: string) => ({ value, label: value })),
          ]}
        />
      );
    }
  }

  if (field.foreignKey !== undefined) {
    return (
      <Input
        data-testid={`${field.name}-input`}
        layout="horizontal"
        placeholder="NULL"
        label={field.name}
        value={field.value ?? ""}
        description={
          <>
            {field.comment && (
              <span className="text-sm text-foreground-lighter">{field.comment} </span>
            )}
            <span className="text-sm text-foreground-lighter">
              {field.comment && "("}Has a foreign key relation to
            </span>
            <span className="text-code font-mono text-xs text-foreground-lighter">
              {field.foreignKey.target_table_schema}.{field.foreignKey.target_table_name}.
              {field.foreignKey.target_column_name}
            </span>
            {field.comment && <span className="text-sm text-foreground-lighter">{`)`}</span>}
          </>
        }
        labelOptional={field.format}
        disabled={!isEditable}
        error={errors[field.name]}
        onChange={(event: any) => onUpdateField({ [field.name]: event.target.value })}
        hasSuffix={
          isEditable && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="default" prefixIcon={<Edit />} className="px-1.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-28">
                {field.isNullable && (
                  <DropdownMenuItem onClick={() => onUpdateField({ [field.name]: null })}>
                    Set to NULL
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={onSelectForeignKey}>Select record</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        }
      />
    );
  }

  if (includes(TEXT_TYPES, field.format)) {
    const isTruncated = isValueTruncated(field.value);

    return (
      <div className="text-area-text-sm">
        <Textarea
          data-testid={`${field.name}-input`}
          layout="horizontal"
          label={field.name}
          className="text-sm"
          description={
            <>
              {field.comment && <p>{field.comment}</p>}
              {isTruncated && (
                <p>
                  Note: Value is too large to be rendered in the dashboard. Please expand the editor
                  to edit the value
                </p>
              )}
            </>
          }
          // textAreaClassName="pr-8"
          labelOptional={field.format}
          disabled={!isEditable || isTruncated}
          error={errors[field.name]}
          rows={5}
          value={field.value ?? ""}
          placeholder={
            field.value === null && field.defaultValue === null
              ? "NULL"
              : field.value === ""
                ? "EMPTY"
                : typeof field.defaultValue === "string" && field.defaultValue.length === 0
                  ? "EMPTY"
                  : `NULL (Default: ${field.defaultValue})`
          }
          hasSuffix={
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="default" prefixIcon={<Edit />} className="px-1.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-28">
                {isEditable && (
                  <DropdownMenuItem onClick={() => onUpdateField({ [field.name]: null })}>
                    Set to NULL
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => onEditText({ column: field.name, value: field.value || "" })}
                >
                  Expand editor
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          }
          onChange={(event) => onUpdateField({ [field.name]: event.target.value })}
        />
      </div>
    );
  }

  if (includes(JSON_TYPES, field.format)) {
    const isTruncated = isValueTruncated(field.value);

    return (
      <Input
        data-testid={`${field.name}-input`}
        layout="horizontal"
        value={field.value ?? ""}
        label={field.name}
        description={
          <>
            {field.comment && <p>{field.comment}</p>}
            {isTruncated && (
              <p>
                Note: Value is too large to be rendered in the dashboard. Please expand the editor
                to edit the value
              </p>
            )}
          </>
        }
        labelOptional={field.format}
        disabled={!isEditable || isTruncated}
        placeholder={field?.defaultValue ?? "NULL"}
        error={errors[field.name]}
        onChange={(event: any) => onUpdateField({ [field.name]: event.target.value })}
        hasSuffix={
          <Button
            type="button"
            onClick={() => onEditJson({ column: field.name, value: field.value })}
            prefixIcon={isEditable ? <Edit2 /> : <Eye />}
          >
            {isEditable ? "Edit JSON" : "View JSON"}
          </Button>
        }
      />
    );
  }

  if (includes(DATETIME_TYPES, field.format)) {
    return (
      <DateTimeInput
        name={field.name}
        format={field.format}
        value={field.value ?? ""}
        isNullable={field.isNullable}
        description={
          <>
            {field.defaultValue && <p>Default: {field.defaultValue}</p>}
            {field.comment && <p>{field.comment}</p>}
          </>
        }
        onChange={(value: any) => onUpdateField({ [field.name]: value })}
        disabled={!isEditable}
      />
    );
  }

  if (field.format === "bool") {
    const options = [
      { value: "true", label: "TRUE" },
      { value: "false", label: "FALSE" },
      ...(field.isNullable ? [{ value: "null", label: "NULL" }] : []),
    ];

    const defaultValue = field.value === null ? undefined : field.value;

    return (
      // <FormItemLayout
      //   isReactForm={false}
      //   layout="horizontal"
      //   label={field.name}
      //   labelOptional={field.format}
      //   description={field.comment}
      //   className="[&>div:first-child>span]:text-foreground-lighter"
      // >
      <Select
        value={defaultValue === null ? "null" : defaultValue}
        onValueChange={(value: string) => onUpdateField({ [field.name]: value })}
        disabled={!isEditable}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a value" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      // </FormItemLayout>
    );
  }

  if (field.format === "bytea") {
    return (
      <Input
        data-testid={`${field.name}-input`}
        layout="horizontal"
        label={field.name}
        description={
          <>
            {field.comment && <p>{field.comment}</p>}
            <p>Bytea columns are edited and displayed as hex in the dashboard</p>
          </>
        }
        labelOptional={field.format}
        error={!!errors[field.name]}
        errorMessage={errors[field.name]}
        value={field.value ?? ""}
        placeholder={`\\x`}
        disabled={!isEditable}
        onChange={(event: any) => onUpdateField({ [field.name]: event.target.value })}
      />
    );
  }

  return (
    <Input
      data-testid={`${field.name}-input`}
      layout="horizontal"
      label={field.name}
      description={field.comment}
      labelOptional={field.format}
      error={!!errors[field.name]}
      errorMessage={errors[field.name]}
      value={field.value ?? ""}
      placeholder={
        field.isIdentity
          ? "Automatically generated as identity"
          : field.defaultValue !== null
            ? `Default: ${field.defaultValue}`
            : "NULL"
      }
      disabled={!isEditable}
      onChange={(event: any) => onUpdateField({ [field.name]: event.target.value })}
    />
  );
};

export default InputField;
