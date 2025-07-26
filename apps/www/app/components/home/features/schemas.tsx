import { Checkbox, Column, Fade, Row, Text } from "@nuvix/ui/components"

export const Schemas = () => {
    const roles = [
        { name: "guests", permissions: ["READ"] },
        { name: "users", permissions: ["CREATE", "READ", "UPDATE"] },
        { name: "user:12567", permissions: ["DELETE"] },
        { name: "label:admin", permissions: ["CREATE", "READ", "UPDATE", "DELETE"] },
    ]
    return (
        <div>
            <Fade to="top" pattern={{ display: true, size: '8' }} blur={0.5} padding="4" base={'transparent' as any}>
                <Column background="neutral-alpha-weak" overflow="hidden" className="-rotate-5">
                    <Row gap="12" vertical="center" paddingX="12" paddingY="8" background="neutral-alpha-medium" overflow="hidden" >
                        {['ROLE', 'CREATE', 'READ', 'UPDATE', 'DELETE']
                            .map((h, i) => <Text key={h} variant="body-strong-xs" onBackground="neutral-medium" className={i === 0 ? "w-20 max-w-20 truncate" : ""}>
                                {h}
                            </Text>)}
                    </Row>
                    {roles.map(role => (
                        <Row key={role.name} gap="12" vertical="center" paddingX="12" paddingY="8" horizontal="space-between">
                            <Text variant="body-default-s" onBackground="neutral-weak" className="w-20 max-w-20 truncate">
                                {role.name}
                            </Text>
                            {['CREATE', 'READ', 'UPDATE', 'DELETE'].map(permission => (
                                <Checkbox
                                    key={permission}
                                    isChecked={role.permissions.includes(permission)}
                                    disabled={!role.permissions.includes(permission)}
                                    className="mx-auto"
                                />
                            ))}
                        </Row>
                    ))}
                </Column>
            </Fade>
        </div>
    )
}
