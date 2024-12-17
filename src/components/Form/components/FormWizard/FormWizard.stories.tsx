// Pass props to your component by passing an `args` object to your story
//
// ```jsx
// export const Primary: Story = {
//  args: {
//    propName: propValue
//  }
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { Meta, StoryObj } from "@storybook/react";

import Form from "@/components/Form";
import { Source } from "@storybook/blocks";
import { FormStepComponentProps } from "@/components/Form/components/FormWizard/types";

type FormValues = {
  email: string;
  role: any;
};

const meta: Meta<typeof Form.Wizard> = {
  component: Form.Wizard,
};

export default meta;

type Story = StoryObj<typeof Form.Wizard>;

export const DefaultForm: Story = {
  render() {
    const code = `
      const initialValues = {}

      const headers = ['Step 1', 'Step 2']

      function onSubmit(values: FormValues) {
        // logic
      }

      function Step1(props) {
        const { next } = props as FormStepComponentProps
        return (
          <>
            <Form.TextInput name="email" label="Email" />
            <Form.Button label="Next" onClick={next} />
          </>
        )
      }

      function Step2() {
        return (
          <>
            <Form.TextInput name="password" label="Password" />
            <Form.SubmitButton label="Submit" />
          </>
        )
      }

      return (
        <Form.Wizard
          initialValues={initialValues}
          onSubmit={onSubmit}
          headers={['Step 1', 'Step 2']}
        >
          <Step1 />
          <Step2 />
        </Form.Wizard>
      )
    `;
    return <Source code={code} language="tsx" />;
  },
};

export const FormWizard: Story = {
  render() {
    const initialValues = {};

    const headers = ["Step 1", "Step 2"];

    function onSubmit(values: FormValues) {
      // logic
    }

    function Step1(props) {
      const { next } = props as FormStepComponentProps;
      return (
        <>
          <Form.TextInput name="email" label="Email" />
          <Form.Button label="Next" onClick={next} />
        </>
      );
    }

    function Step2() {
      return (
        <>
          <Form.TextInput name="password" label="Password" />
          <Form.SubmitButton label="Submit" />
        </>
      );
    }

    return (
      <Form.Wizard initialValues={initialValues} onSubmit={onSubmit} headers={["Step 1", "Step 2"]}>
        <Step1 />
        <Step2 />
      </Form.Wizard>
    );
  },
};
