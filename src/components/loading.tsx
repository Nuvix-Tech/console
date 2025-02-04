import { Background, Flex, GlitchFx, Heading, Spinner } from "@/once-ui/components";


export default function LoadingUI() {
    return (
        <>
            <Flex
                fill
                minHeight={16}
                position="relative"
            >
                <Background
                    position="absolute"
                    mask={{
                        cursor: true
                    }}
                    gradient={{
                        colorEnd: 'static-transparent',
                        colorStart: 'accent-solid-strong',
                        display: true,
                        height: 100,
                        opacity: 100,
                        tilt: 0,
                        width: 150,
                        x: 0,
                        y: 0
                    }}
                    dots={{
                        color: 'accent-on-background-medium',
                        display: true,
                        opacity: 100,
                        size: '64'
                    }}
                />
                <Flex
                    fill
                    fillWidth
                    horizontal="center"
                    vertical="center"
                    align="center"
                >
                    <Spinner size="xl" />
                </Flex>
            </Flex>
        </>
    )
}