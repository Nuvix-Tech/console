import { CardBox } from "@/components/others/card";
import { MessagingProviderType } from "@nuvix/console";
import { useFormikContext } from "formik";
import { TopicsSelector } from "./_select_topics";
import { TargetsSelector } from "./_select_targets";

interface SelectTargetsProps {
    type: MessagingProviderType;
}

export const SelectTopicsTargets = ({ type }: SelectTargetsProps) => {
    const { initialValues, setFieldValue } = useFormikContext<Record<string, string[]>>();

    return (
        <CardBox>
            <div className="space-y-4">
                <TopicsSelector type={type} values={initialValues['topics']} onSave={(values: string[]) => setFieldValue('topics', values)} />
                <TargetsSelector type={type} values={initialValues['targets']} onSave={(values: string[]) => setFieldValue('targets', values)} />
            </div>
        </CardBox>
    );
};
