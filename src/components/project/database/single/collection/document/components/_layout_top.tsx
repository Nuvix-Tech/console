import React from "react";
import { Button, Card, Stack } from "@chakra-ui/react"
import { Tabs } from "@chakra-ui/react"
import { IDChip } from "@/components/others";
import { useRouter } from "@bprogress/next";

interface LayoutTopProps {
    title: string;
    id?: string;
}

export const LayoutTop: React.FC<LayoutTopProps> = ({ title, id }) => {
    const { push } = useRouter();
    return (
        <>
            <Card.Root variant='subtle' rounded='lg' mx="28" flexDirection='row' my="8">
                <Stack direction='column'>
                    <Card.Title>{title}</Card.Title>
                    {id && <Card.Description>
                        <IDChip id={id} />
                    </Card.Description>}
                </Stack>
                {/* <Card.Footer> */}
                <Tabs.Root variant='subtle' onChange={(e) => { alert(e.target) }}>
                    <Tabs.List>
                        <Tabs.Trigger value="oerview">
                            Overview
                        </Tabs.Trigger>
                        <Tabs.Trigger value="data" onClick={() => push('data')}>
                            Data
                        </Tabs.Trigger>
                        <Tabs.Trigger value="logs">
                            Activity
                        </Tabs.Trigger>
                    </Tabs.List>
                </Tabs.Root>
                {/* </Card.Footer> */}
            </Card.Root>
        </>
    )
}