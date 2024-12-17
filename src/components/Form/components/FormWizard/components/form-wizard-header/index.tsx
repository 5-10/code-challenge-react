import React from "react";
import { Item, List } from "./style";

type HeaderProps = {
  step: number;
  tabs: (string | React.ReactElement)[];
  onStepChange?(step: number): void;
  previousStep(): void;
  secondary?: boolean;
};

export default function FormWizardHeader({ step, tabs, ...props }: HeaderProps) {
  const notLastStep = step !== tabs.length;

  function onStepChange(newStep: number) {
    if (newStep > step && notLastStep) {
      props.onStepChange && props.onStepChange(newStep);
    }
  }

  return (
    <>
      <List>
        {tabs.map((label, index: number) => {
          const isCurrentStep = step === index + 1;

          const isActionable = index + 1 < step;

          function onClick() {
            onStepChange(index + 1);

            if (isActionable) {
              props.previousStep();
            }
          }

          return (
            <Item key={index} active={isCurrentStep} onClick={onClick} isActionable={isActionable}>
              <span>{label}</span>
            </Item>
          );
        })}
      </List>
    </>
  );
}
