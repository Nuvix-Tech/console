import React, { Fragment, PropsWithChildren, useEffect, useState } from "react";
import { useFormikContext } from "formik";
import {
  Chip,
  CloseButton,
  InputProps,
  NumberInput,
  NumberInputProps,
  PasswordInput,
  Switch,
  SwitchProps,
  TagInput,
  TagInputProps,
} from "@/ui/components";
import { LuPlus } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/ui/components";
import { RadioGroup } from "@/components/ui/radio-group";

interface Props extends Omit<InputProps, "onChange" | "value" | "id"> {
  name: string;
}

const Wrapper = ({ Field, ...props }: { Field: any }) => {
  const { name, label, placeholder, description, ...rest } = props as Props;
  const { values, handleBlur, handleChange } =
    useFormikContext<Record<string, string | number>>();

  return (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <Field
          name={name}
          placeholder={placeholder ?? label}
          value={values[name]}
          onChange={handleChange}
          onBlur={handleBlur}
          labelAsPlaceholder
          {...rest}
        />
      </FormControl>
      {description && <FormDescription>{description} </FormDescription>}
      <FormMessage field={name} />
    </FormItem>
  )
}

type InputFieldProps = Props;

export const InputField = (props: InputFieldProps) => {
  const InputComponent = props.type === "password" ? PasswordInput : Input;
  const { setFieldValue, values } =
    useFormikContext<Record<string, string | number>>();

  return <Wrapper Field={InputComponent} {...props} />;
}

export const InputNumberField = (props: Props & NumberInputProps) => {
  const { setFieldValue, values } =
    useFormikContext<Record<string, string | number>>();
  return <Wrapper Field={NumberInput} onChange={(v: number) => setFieldValue(props.name, v)} value={values[props.name] && Number(values[props.name])} {...props} />;
};

export const InputSwitchField = (props: Omit<SwitchProps, "onToggle" | "isChecked"> & Props) => {
  const { name, label, placeholder, description, ...rest } = props
  const { values, handleBlur, setFieldValue } =
    useFormikContext<Record<string, boolean>>();

  return (
    <FormItem>
      <FormControl>
        <Switch
          onBlur={handleBlur}
          isChecked={values[name]}
          onToggle={(() => setFieldValue(name, !values[name])) as any}
          {...rest}
        />
      </FormControl>
      {description && <FormDescription>{description} </FormDescription>}
      <FormMessage field={name} />
    </FormItem>
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
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <div className="flex flex-col gap-2 w-full">
          <TagInput
            id={id}
            value={values[name]}
            error={!!(errors[name] && touched[name])}
            {...rest}
            onBlur={handleBlur}
            onChange={(v) => setFieldValue(name, v)}
          />
          {suggestion.length ? (
            <>
              <div className="flex flex-wrap gap-2">
                {suggestion
                  .filter((v) => !removeOnSelect || !values.name.includes(v))
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
}

type Values = { key: string; value: string | any }[];

export const InputObjectField: React.FC<InputObjectFieldProps> = ({
  label,
  helperText,
  optionalText,
  name,
  ...rest
}) => {
  const [_values, setValues] = useState<Values>([]);
  const { values, errors, touched, setFieldValue, initialValues } =
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
    setValues([..._values, { key: "", value: "" }]);
  };

  const handleDeleteField = (index: number) => {
    const newValues: Values = [..._values];
    newValues.splice(index, 1);
    setValues(newValues);
  };

  return (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <div className="w-full flex flex-col gap-2 items-start">
          <div className="w-full flex gap-2 pr-8">
            <FormLabel>Key</FormLabel>
            <FormLabel>Value</FormLabel>
          </div>
          <div className="w-full flex flex-col gap-2">
            {_values.map(({ key, value }, i) => (
              <Fragment key={i}>
                <div className="w-full flex gap-4">
                  <Input
                    placeholder="Enter Key"
                    height="s"
                    labelAsPlaceholder
                    value={key}
                    onChange={(e) => handleFieldChange("key", e.target.value, i)}
                  />

                  <Input
                    placeholder="Enter Value"
                    height="s"
                    labelAsPlaceholder
                    value={value}
                    onChange={(e) => handleFieldChange("value", e.target.value, i)}
                  />

                  <CloseButton
                    onClick={() => handleDeleteField(i)}
                    disabled={_values.length === 1}
                  />
                </div>
              </Fragment>
            ))}
          </div>
          <Button type="button" variant="ghost" className="text-xs" onClick={handleAddField}>
            <LuPlus />
            Add Field
          </Button>
        </div>
      </FormControl>
      {helperText && <FormDescription>{helperText}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
};

type RadioFieldProps = Props & PropsWithChildren;

export const RadioField = (props: RadioFieldProps) => {
  const { children, ...rest } = props;
  const { values, handleChange } = useFormikContext<Record<string, string>>();

  return (
    <FormItem>
      {rest.label && <FormLabel>{rest.label}</FormLabel>}
      <FormControl>
        <RadioGroup
          onValueChange={handleChange}
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
