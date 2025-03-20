import { Button, CloseButton, Drawer, Portal, UseStepsReturn, Steps } from "@chakra-ui/react";
import React from "react";

interface StepperProps {
  steps: { title: string; node: React.ReactNode }[];
  value: UseStepsReturn;
  trigger?: React.ReactNode;
  title: string;
}

export const StepperDrawer: React.FC<
  StepperProps & Omit<React.ComponentProps<typeof Drawer.Root>, "children">
> = ({ steps, trigger, title, value, ...props }) => {
  return (
    <Drawer.Root {...props}>
      {trigger && <Drawer.Trigger asChild> {trigger} </Drawer.Trigger>}
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Steps.Root defaultStep={1} count={steps.length}>
              <Drawer.Header>
                <Drawer.Title>{title}</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Steps.List>
                  {steps.map((step, index) => (
                    <Steps.Item key={index} index={index} title={step.title}>
                      <Steps.Indicator />
                      <Steps.Title>{step.title}</Steps.Title>
                      <Steps.Separator />
                    </Steps.Item>
                  ))}
                </Steps.List>

                {steps.map((step, index) => (
                  <Steps.Content key={index} index={index}>
                    {step.node}
                  </Steps.Content>
                ))}
              </Drawer.Body>
              <Drawer.Footer>
                <Steps.PrevTrigger asChild>
                  <Button>Prev</Button>
                </Steps.PrevTrigger>
                <Steps.NextTrigger asChild>
                  <Button>Next</Button>
                </Steps.NextTrigger>
              </Drawer.Footer>
            </Steps.Root>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};
