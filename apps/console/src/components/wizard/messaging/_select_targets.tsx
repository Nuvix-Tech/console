import { CardBox } from "@/components/others/card";
import { InputField, InputTextareaField } from "@/components/others/forms";
import { useFormikContext } from "formik";
import React from "react";


export const SelectTargets = () => {
    const { values, setFieldValue } = useFormikContext<Record<string, string | boolean>>();

    return (
        <>
            <CardBox>
                <div className="space-y-4">

                </div>
            </CardBox>
        </>
    );
};
