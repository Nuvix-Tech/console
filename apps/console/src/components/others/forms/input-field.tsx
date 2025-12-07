import React, { FormEvent, Fragment, PropsWithChildren, useEffect, useState } from "react";
import { useFormikContext } from "formik";
import {
  Button,
  Chip,
  CloseButton,
  InputProps,
  NumberInput,
  NumberInputProps,
  PasswordInput,
  Select,
  Switch,
  SwitchProps,
  TagInput,
  TagInputProps,
  Textarea,
  TextareaProps,
} from "@nuvix/ui/components";
import { LuPlus } from "react-icons/lu";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@nuvix/sui/components/form";
import { Input } from "@nuvix/ui/components";
import { RadioGroup } from "@nuvix/sui/components/radio-group";
import { PlusIcon } from "lucide-react";
import { cn } from "@nuvix/sui/lib/utils";

interface OverrideProps {
  label?: React.ReactNode;
}

interface Props
  extends Omit<InputProps, "onChange" | "value" | "id" | keyof OverrideProps>,
    OverrideProps {
  name: string;
  descriptionSide?: "left" | "right";
}

export const FieldWrapper = ({
  name,
  label,
  description,
  layout = "vertical",
  children,
  labelClass = "mt-4",
  descriptionSide = "left",
  ...props
}: Props & {
  children: React.ReactNode;
  layout?: "vertical" | "horizontal";
  labelClass?: string;
}) => {
  const labelComponent = label ? <FormLabel>{label}</FormLabel> : null;
  const descriptionComponent = description ? (
    <FormDescription>{description}</FormDescription>
  ) : null;

  if (layout === "vertical") {
    return (
      <FormItem {...(props as Props)}>
        {labelComponent}
        <FormControl>{children}</FormControl>
        {descriptionComponent}
        <FormMessage field={name} />
      </FormItem>
    );
  }

  return (
    <FormItem {...(props as Props)}>
      <div className="flex items-start gap-6">
        <div
          className={cn("min-w-[30%] max-w-[30%]", {
            [labelClass]: !description || descriptionSide === "right",
          })}
        >
          {labelComponent}
          {descriptionSide === "left" && descriptionComponent}
        </div>

        <div className="flex-1">
          <FormControl>{children}</FormControl>
          <div className="mt-1">
            {descriptionSide === "right" && descriptionComponent}
            <FormMessage field={name} />
          </div>
        </div>
      </div>
    </FormItem>
  );
};

const Wrapper = ({ Field, ...props }: { Field: any } & any) => {
  const { name, label, placeholder, description, ...rest } = props as Props & any;
  const { values, handleBlur, handleChange } = useFormikContext<Record<string, string | number>>();

  const fieldProps = {
    name,
    placeholder: placeholder ?? label,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    labelAsPlaceholder: true,
    ...rest,
  };

  return (
    <FieldWrapper
      name={name}
      label={label}
      description={description}
      layout={props.layout}
      {...props}
    >
      <Field {...fieldProps} />
    </FieldWrapper>
  );
};

type InputFieldProps = Props;

export const InputField = (props: InputFieldProps) => {
  const InputComponent = (() => {
    switch (props.type) {
      case "password":
        return PasswordInput;
      default:
        return Input;
    }
  })();

  return <Wrapper Field={InputComponent} {...props} />;
};

export const InputNumberField = (props: Props & NumberInputProps) => {
  const { setFieldValue, values } = useFormikContext<Record<string, string | number>>();
  return (
    <Wrapper
      Field={NumberInput}
      onChange={(v: number | FormEvent<HTMLInputElement>) => {
        let valueToSet: number | string = v as any;
        if (v && typeof v !== "number") {
          const parsedValue = Number((v.target as any).value);
          valueToSet = isNaN(parsedValue) ? "" : parsedValue;
        }

        setFieldValue(props.name, valueToSet);
      }}
      value={values[props.name]}
      {...props}
    />
  );
};

export const InputTextareaField = (props: Props & TextareaProps) => {
  const { setFieldValue, values } = useFormikContext<Record<string, string | number>>();
  return (
    <Wrapper
      {...props}
      Field={Textarea}
      onChange={(e: any) => {
        setFieldValue(props.name, e.target.value);
      }}
      value={values[props.name] ?? ""}
    />
  );
};

export const InputSwitchField = (
  props: Omit<SwitchProps, "onToggle" | "isChecked"> & Props & { innerDesc?: boolean },
) => {
  const { name, label, placeholder, layout, innerDesc, description, ...rest } = props;
  const { values, handleBlur, setFieldValue } = useFormikContext<Record<string, boolean>>();

  return (
    <FieldWrapper
      {...rest}
      layout={layout}
      label={layout === "horizontal" ? label : ""}
      name={name}
      description={innerDesc ? undefined : description}
      labelClass="mt-1.5"
    >
      <Switch
        label={layout === "horizontal" ? undefined : label}
        onBlur={handleBlur}
        description={!innerDesc ? undefined : description}
        isChecked={values[name]}
        onToggle={(() => setFieldValue(name, !values[name])) as any}
        {...rest}
      />
    </FieldWrapper>
  );
};

type InputTagFieldProps = Omit<TagInputProps, "onChange" | "value" | "id"> &
  Props & {
    suggestion?: string[];
    removeOnSelect?: boolean;
  };

export const InputTagField = (props: InputTagFieldProps) => {
  const { suggestion = [], removeOnSelect, name, label, placeholder, description, ...rest } = props;
  const { values, errors, touched, handleBlur, setFieldValue } =
    useFormikContext<Record<string, string[]>>();
  const id = React.useId();

  return (
    <FormItem {...props}>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <div className="flex flex-col gap-2 w-full">
          <TagInput
            id={id}
            value={[...values[name]]}
            error={!!(errors[name] && touched[name])}
            {...rest}
            onBlur={handleBlur}
            onChange={(v) => setFieldValue(name, v)}
          />
          {suggestion.length ? (
            <>
              <div className="flex flex-wrap gap-2">
                {suggestion
                  .filter((v) => !removeOnSelect || !values[name]?.includes(v))
                  .map((s, i) => (
                    <Chip
                      label={s}
                      key={i}
                      onClick={() => {
                        const newValue = removeOnSelect
                          ? [...values[name], s]
                          : values[name].includes(s)
                            ? values[name].filter((val) => val !== s)
                            : [...values[name], s];
                        setFieldValue(name, newValue);
                      }}
                      prefixIcon="plus"
                      selected={false}
                    />
                  ))}
              </div>
            </>
          ) : null}
        </div>
      </FormControl>
      {description && <FormDescription>{description} </FormDescription>}
      <FormMessage />
    </FormItem>
  );
};

interface InputObjectFieldProps {
  name: string;
  label?: string;
  helperText?: string;
  optionalText?: string;
  disabled?: boolean;
}

type Values = { key: string; value: string | any }[];

export const InputObjectField: React.FC<InputObjectFieldProps> = ({
  label,
  helperText,
  optionalText,
  name,
  disabled,
  ...rest
}) => {
  const [_values, setValues] = useState<Values>([]);
  const { setFieldValue, initialValues } =
    useFormikContext<Record<string, { [key: string]: string }>>();

  useEffect(() => {
    const values: Record<string, string> = {};
    _values.map(({ key, value }) => key && (values[key] = value));
    setFieldValue(name, values);
  }, [_values]);

  useEffect(() => {
    let values: Values = [];
    Object.entries(initialValues[name] ?? {}).map(([key, value], i) =>
      values.push({ key: key, value: value }),
    );
    setValues(values.length ? values : [{ key: "", value: "" }]);
  }, [initialValues]);

  const handleFieldChange = (key: "key" | "value", value: string, index: number) => {
    const newValues: Values = [..._values];
    newValues[index][key] = value;
    setValues(newValues);
  };

  const handleAddField = () => {
    setValues((prev) => [...prev, { key: "", value: "" }]);
  };

  const handleDeleteField = (index: number) => {
    const newValues: Values = [..._values];
    newValues.splice(index, 1);
    setValues(newValues);
    if (newValues.length === 0) {
      handleAddField();
    }
  };

  const canNotAdd =
    _values.length === 1 && !!_values.find(({ key, value }) => !(key.trim() && value.trim()));

  return (
    <FormItem name={name} {...rest}>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <div className="w-full flex flex-col gap-2 items-start">
          <div className="w-full flex gap-2 pr-8">
            <FormLabel className="w-full">Key</FormLabel>
            <FormLabel className="w-full">Value</FormLabel>
          </div>
          <div className="w-full flex flex-col gap-2">
            {_values.map(({ key, value }, i) => (
              <Fragment key={i}>
                <div className="w-full flex gap-4 items-center">
                  <Input
                    placeholder="Enter Key"
                    height="s"
                    labelAsPlaceholder
                    value={key}
                    disabled={disabled}
                    onChange={(e) => handleFieldChange("key", e.target.value, i)}
                  />

                  <Input
                    placeholder="Enter Value"
                    height="s"
                    labelAsPlaceholder
                    value={value}
                    disabled={disabled}
                    onChange={(e) => handleFieldChange("value", e.target.value, i)}
                  />

                  <CloseButton
                    type="button"
                    onClick={() => handleDeleteField(i)}
                    disabled={disabled}
                  />
                </div>
              </Fragment>
            ))}
          </div>
          <Button
            type="button"
            variant="tertiary"
            size="s"
            className="text-sm items-center"
            onClick={handleAddField}
            justifyContent="center"
            disabled={canNotAdd || disabled}
          >
            <span className="flex items-center gap-1">
              <PlusIcon size={18} />
              Add Field
            </span>
          </Button>
        </div>
      </FormControl>
      {helperText && <FormDescription>{helperText}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
};

type SelectObjectFieldInputProps = {
  label: string;
  options: React.ComponentProps<typeof Select>["options"];
  placeholder?: string;
};

type SelectObjectFieldProps = Pick<InputObjectFieldProps, "label" | "name"> & {
  left: SelectObjectFieldInputProps;
  right: SelectObjectFieldInputProps;
  description?: string;
  addText?: string;
  portal?: boolean;
};

export const SelectObjectField: React.FC<SelectObjectFieldProps> = ({
  label,
  left,
  right,
  name,
  description,
  portal,
  ...rest
}) => {
  const [_values, setValues] = useState<Values>([]);
  const { setFieldValue, initialValues } =
    useFormikContext<Record<string, { [key: string]: string }>>();

  useEffect(() => {
    const values: Record<string, string> = {};
    _values.map(({ key, value }) => key && (values[key] = value));
    setFieldValue(name, values);
  }, [_values]);

  useEffect(() => {
    let values: Values = [];
    Object.entries(initialValues[name] ?? {}).map(([key, value], i) =>
      values.push({ key: key, value: value }),
    );
    setValues(values.length ? values : [{ key: "", value: "" }]);
  }, [initialValues]);

  const handleFieldChange = (key: "key" | "value", value: string, index: number) => {
    const newValues: Values = [..._values];
    newValues[index][key] = value;
    setValues(newValues);
  };

  const handleAddField = () => {
    setValues((prev) => [...prev, { key: "", value: "" }]);
  };

  const handleDeleteField = (index: number) => {
    const newValues: Values = [..._values];
    newValues.splice(index, 1);
    setValues(newValues);
    if (newValues.length === 0) {
      handleAddField();
    }
  };

  return (
    <FormItem name={name} {...rest}>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <div className="w-full flex flex-col gap-2 items-start">
          <div className="w-full flex gap-2 pr-8">
            <FormLabel className="w-full">{left.label}</FormLabel>
            <FormLabel className="w-full">{right.label}</FormLabel>
          </div>
          <div className="w-full flex flex-col gap-2">
            {_values.map(({ key, value }, i) => (
              <Fragment key={i}>
                <div className="w-full flex gap-4 items-center">
                  <Select
                    placeholder={left.placeholder}
                    value={key}
                    options={left.options}
                    portal={portal}
                    height="s"
                    labelAsPlaceholder
                    onSelect={(v) => handleFieldChange("key", v, i)}
                  />
                  <Select
                    placeholder={right.placeholder}
                    value={value}
                    portal={portal}
                    options={right.options}
                    height="s"
                    labelAsPlaceholder
                    onSelect={(v) => handleFieldChange("value", v, i)}
                  />

                  <CloseButton
                    type="button"
                    onClick={() => handleDeleteField(i)}
                    // disabled={_values.length === 1}
                  />
                </div>
              </Fragment>
            ))}
          </div>
          <Button
            type="button"
            size="s"
            variant="tertiary"
            className="text-sm"
            onClick={handleAddField}
          >
            <LuPlus size={18} />
            {rest.addText ?? "Add Field"}
          </Button>
        </div>
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
};

type RadioFieldProps = Props & PropsWithChildren;

export const RadioField = (props: RadioFieldProps) => {
  const { children, ...rest } = props;
  const { values, handleChange } = useFormikContext<Record<string, string>>();

  return (
    <FormItem {...props}>
      {rest.label && <FormLabel>{rest.label}</FormLabel>}
      <FormControl>
        <RadioGroup
          onValueChange={handleChange}
          defaultValue={values[rest.name]}
          name={rest.name}
          value={values[rest.name]}
          className="flex flex-col space-y-1"
        >
          {children}
        </RadioGroup>
      </FormControl>
      {rest.description && <FormDescription>{rest.description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
};

export const InputSelectField = ({
  options,
  name,
  label,
  description,
  nullable = false,
  ...props
}: Omit<React.ComponentProps<typeof Select>, "onChange" | "value" | "id" | keyof OverrideProps> & {
  name: string;
  nullable?: boolean;
} & OverrideProps) => {
  const { setFieldValue, values } = useFormikContext<Record<string, string | null>>();
  const value = values[name];
  const _onChange = (v: string) => {
    if ((v === "null" || v === "") && nullable) {
      setFieldValue(name, null);
    } else {
      setFieldValue(name, v);
    }
  };
  return (
    <FormItem {...(props as Props)}>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <Select
          {...props}
          labelAsPlaceholder
          value={value == null && nullable ? "null" : (value ?? undefined)}
          options={options}
          onSelect={_onChange}
        />
      </FormControl>
      {description && <FormDescription>{description} </FormDescription>}
      <FormMessage field={name} />
    </FormItem>
  );
};
