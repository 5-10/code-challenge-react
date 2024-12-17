import React from 'react';
import { Formik, FormikConfig, FormikHelpers, FormikProps } from 'formik';
import withForm from '@/components/Form/hoc/withForm';
import {
  buildFormContext,
  FormContext,
} from '@/components/Form/hooks/use-form-context';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { AnyObject } from '@9yco/utils.utils';
import { isFunction } from 'lodash';

import TextInput, {
  TextInputProps as TextInputProps,
} from '@/components/TextInput';
import SubmitButton from './components/submit-button';
import FormGlobalError from '@/components/Form/components/FormGlobalError';
import FormWizard from '@/components/Form/components/FormWizard';
import { StyledForm, FieldSet, Footer } from './style';
import { removeTypeName } from '@/components/Form/utils';
import { SubmitOnEnter } from './components/SubmitOnEnter';
import If from '@/components/If/If';

export type { FormContext } from '@/components/Form/hooks/use-form-context';

export type FormActions<Values = AnyObject> = FormikHelpers<Values>;

export interface FormProps<Values = AnyObject> extends FormikConfig<Values> {
  children?: FormChildrenFunction | React.ReactNode;
  submitOnEnter?: boolean | string[]; // list of names of fields on which the enter key should submit the form (if true, all fields will submit)
}
type FormChildrenFunction<Values = any> = (
  props: FormContext<Values>,
) => React.ReactNode;

export type FormOnSubmit<Values = any> = FormProps<Values>['onSubmit'];

const defaultProps = {
  enableReinitialize: true,
  validateOnChange: false,
  validateOnBlur: false,
};

function Form({ children, ...props }: FormProps) {
  const validationSchema = props.validationSchema
    ? toFormikValidationSchema(props.validationSchema)
    : undefined;

  const wrapperRef = React.useRef<HTMLFormElement>(null);
  async function onSubmit(formValues: AnyObject, actions: FormActions) {
    try {
      actions.setSubmitting(true);
      await props.onSubmit(formValues, actions);
      actions.setSubmitting(false);
    } catch (error) {
      actions.setStatus({
        serverError: error.message,
        globalError: error.message,
      });

      actions.setSubmitting(false);
    }
  }

  return (
    <Formik
      {...props}
      initialValues={removeTypeName(props.initialValues)}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(form: FormikProps<AnyObject>) => {
        return (
          <StyledForm ref={wrapperRef}>
            {props.submitOnEnter && (
              <SubmitOnEnter
                wrapperRef={wrapperRef}
                submitOnEnter={props.submitOnEnter}
              />
            )}
            <If condition={isFunction(children)}>
              {/* we do not render field set component to allow setting custom field set properties in some cases */}
              <If.Then>
                {isFunction(children) && children(buildFormContext(form))}
              </If.Then>
              <If.Else>
                {/* We render field set component with specific gap */}
                <FieldSet>{children as React.ReactNode}</FieldSet>
              </If.Else>
            </If>
          </StyledForm>
        );
      }}
    </Formik>
  );
}

Form.defaultProps = defaultProps;

const FormComponents = {
  TextInput: withForm<TextInputProps>(TextInput),
  GlobalError: FormGlobalError,
  Wizard: FormWizard,
  SubmitButton,
  Footer,
  FieldSet,
};

export default Object.assign<typeof Form, typeof FormComponents>(
  Form,
  FormComponents,
);
