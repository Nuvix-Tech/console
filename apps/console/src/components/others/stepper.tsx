import { Button, Text } from "@nuvix/ui/components";
import {
  CloseButton,
  Drawer,
  Portal,
  UseStepsReturn,
  Steps,
  StepsRootProvider,
  useStepsContext,
} from "@chakra-ui/react";
import React from "react";
import { Form } from "./forms";

export interface StepperProps {
  steps: { title: string; node: React.ReactNode }[];
  value: UseStepsReturn;
  trigger?: React.ReactNode;
  title: string;
  form: Omit<React.ComponentProps<typeof Form>, "children">;
  lastStep?: React.ReactNode;
}

export const StepperDrawer: React.FC<
  StepperProps & Omit<React.ComponentProps<typeof Drawer.Root>, "children">
> = ({ steps, trigger, title, value, form, lastStep, ...props }) => {
  return (
    <Drawer.Root {...props}>
      {trigger && <Drawer.Trigger asChild> {trigger} </Drawer.Trigger>}
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content height="full" asChild>
            <Form {...form} className="w-full">
              <StepsRootProvider value={value} height="full">
                <Steps.Root height="full">
                  <Drawer.Header display="flex" flexDirection="column" gap={4} className="!w-full">
                    <Drawer.Title>{title}</Drawer.Title>
                    <Steps.List className="justify-between">
                      {steps.map((step, index) => (
                        <Steps.Item key={index} index={index} title={step.title}>
                          <div className="flex gap-2 items-center">
                            <Steps.Indicator boxSize={"8"} />
                            <Steps.Title>
                              <Text variant="label-strong-m">{step.title}</Text>
                            </Steps.Title>
                          </div>
                          <Steps.Separator />
                        </Steps.Item>
                      ))}
                    </Steps.List>
                    <div className="absolute right-4 top-4">
                      <Drawer.CloseTrigger asChild>
                        <CloseButton size="sm" />
                      </Drawer.CloseTrigger>
                    </div>
                  </Drawer.Header>
                  <Drawer.Body>
                    {steps.map((step, index) => (
                      <Steps.Content key={index} index={index}>
                        {step.node}
                      </Steps.Content>
                    ))}
                  </Drawer.Body>
                  <Drawer.Footer className="border-t">
                    <Footer comp={lastStep} />
                  </Drawer.Footer>
                </Steps.Root>
              </StepsRootProvider>
            </Form>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

const Footer = ({ comp }: { comp: React.ReactNode }) => {
  const { count, hasNextStep, hasPrevStep, value } = useStepsContext();

  return (
    <>
      {hasPrevStep && (
        <Steps.PrevTrigger asChild>
          <Button>Prev</Button>
        </Steps.PrevTrigger>
      )}
      {hasNextStep && (
        <Steps.NextTrigger asChild>
          <Button>Next</Button>
        </Steps.NextTrigger>
      )}
      {count === value && comp}
    </>
  );
};
