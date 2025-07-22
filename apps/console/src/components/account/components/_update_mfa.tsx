import {
    CardBox,
    CardBoxBody,
    CardBoxItem,
    CardBoxTitle,
    CardBoxDesc,
} from "@/components/others/card";
import { Switch, useToast } from "@nuvix/ui/components";
import { useAppStore } from "@/lib/store";
import { sdkForConsole } from "@/lib/sdk";
import { useState } from "react";

export const UpdateMfa = () => {
    const { user, setUser } = useAppStore((s) => s);
    const { addToast } = useToast();
    const [mfaLoading, setMfaLoading] = useState(false);

    const onSubmit = async (value: boolean) => {
        setMfaLoading(true);
        try {
            const res = await sdkForConsole?.account.updateMFA(value);
            addToast({
                variant: "success",
                message: "Mfa status has been updated successfully.",
            });
            setUser(res);
        } catch (e: any) {
            addToast({
                variant: "danger",
                message: e.message,
            });
        } finally {
            setMfaLoading(false);
        }
    };

    return (
        <>
            <CardBox>
                <CardBoxBody>
                    <CardBoxItem gap={"4"}>
                        <CardBoxTitle>Multi-factor authentication</CardBoxTitle>
                        <CardBoxDesc>
                            Enhance your account's security by requiring a second sign-in method.
                            <br />
                            <a>Learn more</a>
                        </CardBoxDesc>
                    </CardBoxItem>
                    <CardBoxItem>
                        <Switch
                            label={"Multi-factor authentication"}
                            reverse
                            loading={mfaLoading}
                            disabled={mfaLoading}
                            isChecked={user.mfa}
                            onToggle={() => onSubmit(!user.mfa)}
                        />
                    </CardBoxItem>
                </CardBoxBody>
            </CardBox>
        </>
    );
};
