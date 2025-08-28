import { Models } from "@nuvix/console";
import { UpdateField } from "./_data_field";
import { DynamicField } from ".";
import {
  generateYupSchema,
  type AttributeTypes,
  Attributes,
  AttributeFormat,
} from "../../../../../collection-editor/SidePanelEditor/ColumnEditor/utils";
import React from "react";

interface DataMapperProps<T = Models.Document> {
  document: T;
  attributes: AttributeTypes[];
}

interface CommonProps {
  name: string;
  nullable: boolean;
  isArray?: boolean;
  type: Attributes | AttributeFormat;
  options?: any;
}

export const DataMapper = <T,>({ attributes, document }: DataMapperProps<T>) => {
  return attributes.map((attribute, index) => {
    let schema = generateYupSchema([attribute]);
    const commonProps: CommonProps = {
      name: attribute.key,
      nullable: !attribute.required,
      isArray: attribute.array,
      type: Attributes.String as Attributes | AttributeFormat,
      options: !attribute.required ? [{ value: "null", label: "NULL" }] : [],
    };

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <UpdateField
        schema={schema}
        name={attribute.key}
        value={document[attribute.key as keyof T]}
        key={index}
        attribute={attribute}
      >
        {children}
      </UpdateField>
    );

    switch (attribute.type as Attributes) {
      case Attributes.String:
        if ("format" in attribute) {
          switch (attribute.format as AttributeFormat) {
            case AttributeFormat.Email:
            case AttributeFormat.Url:
            case AttributeFormat.Ip:
              commonProps.type = attribute.format as AttributeFormat;
              break;
            case AttributeFormat.Enum:
              commonProps.type = AttributeFormat.Enum;
              commonProps.options.push(
                ...(attribute as Models.AttributeEnum).elements.map((v) => ({
                  value: v,
                  label: v,
                })),
              );
              break;
          }
        }
        return (
          <Wrapper>
            <DynamicField {...commonProps} size={(attribute as Models.AttributeString)?.size} />
          </Wrapper>
        );
      case Attributes.Float:
      case Attributes.Integer:
        return (
          <Wrapper>
            <DynamicField
              {...commonProps}
              min={(attribute as Models.AttributeInteger).min}
              max={(attribute as Models.AttributeInteger).max}
              type={attribute.type as Attributes}
            />
          </Wrapper>
        );
      case Attributes.Boolean:
        commonProps.options = [
          { value: "true", label: "True" },
          { value: "false", label: "False" },
        ];
        return (
          <Wrapper>
            <DynamicField {...commonProps} type={Attributes.Boolean} />
          </Wrapper>
        );
      case Attributes.Timestamptz:
        return (
          <Wrapper>
            <DynamicField {...commonProps} type={Attributes.Timestamptz} />
          </Wrapper>
        );
      case Attributes.Relationship:
        return (
          <Wrapper>
            <DynamicField {...commonProps} type={Attributes.Relationship} />
          </Wrapper>
        );
      default:
        return null;
    }
  });
};
