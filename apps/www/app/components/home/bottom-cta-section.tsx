import { Button, Column, Text } from "@nuvix/ui/components"
import { DASHBOARD_URL, DOCS_URL } from "~/lib/constants"

export const BottomCtaSection = () => {

    return (
        <Column className="py-12 bg-(--brand-alpha-weak)/30 relative" >
            <div className="mx-auto max-w-3xl text-center">
                <Text variant="display-strong-xs" as="h2" onBackground="brand-weak">
                    Try Nuvix for Free
                </Text>
                <Text onBackground="neutral-weak" as="p">
                    Sign up for a free account and start building with Nuvix today.
                </Text>
                <div className="mt-6 flex justify-center gap-4">
                    <Button href={`${DASHBOARD_URL}/auth/register`}>
                        Get started
                    </Button>
                    <Button href={DOCS_URL} variant="secondary">
                        Read the Docs
                    </Button>
                </div>
            </div>
        </Column>
    )
}