import { CardBox } from "@/components/others/card";
import { MessagingProviderType } from "@nuvix/console";
import { useFormikContext } from "formik";
import { BaseMessageFormData } from "../_types";
import { TopicsSelector } from "./_select_topics";
import { TargetsSelector } from "./_select_targets";

interface SelectTargetsProps {
  type: MessagingProviderType;
}

export const SelectTopicsTargets = ({ type }: SelectTargetsProps) => {
  const { values, setFieldValue } = useFormikContext<BaseMessageFormData>();

  const handleTopicsChange = (topicIds: string[]) => {
    setFieldValue("topics", topicIds);
  };

  const handleTargetsChange = (targetIds: string[]) => {
    setFieldValue("targets", targetIds);
  };

  return (
    <CardBox>
      <div className="space-y-4">
        <TopicsSelector type={type} values={values.topics || []} onSave={handleTopicsChange} />
        <TargetsSelector type={type} values={values.targets || []} onSave={handleTargetsChange} />
      </div>
    </CardBox>
  );
};
