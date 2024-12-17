import React, { SyntheticEvent } from "react";
import If from "@/components/If/If";
import withForwardRef from "@/hoc/withForwardRef";
import hoistNonReactStatics from "hoist-non-react-statics";
import { connect, FormikProps } from "formik";
import { Container, ErrorMessageComponent } from "./style";

import { get, isFunction, isPlainObject, noop, omit } from "lodash";

interface InternalFormFieldProps {
  name: string;
  formik?: FormikProps<any>;
  errorMessage?: ErrorMessageFunction | string;
  touched?: boolean;
  invalid?: boolean;
  wasSubmitted?: boolean;
  onChange?(value: any): void;
  onBlur?: (event: React.SyntheticEvent<HTMLInputElement>) => void;
  forwardedRef?: React.Ref<HTMLFormElement>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  required?: boolean;
  errorKey?: string;
  defaultValue?: any;
  submitOnChange?: boolean;
}

export interface InjectedFormElementProps {
  name: string;
  touched: boolean;
  invalid: boolean;
  value: any;
  onChange: React.ChangeEventHandler;
  onBlur: React.FocusEventHandler;
  errorMessage: string;
  wasSubmitted: boolean;
}

export type FormFieldProps = Omit<InternalFormFieldProps, "formik" | "errorKey" | "invalid" | "touched">;

type ErrorMessageFunction = (input: { touched: boolean; error: string; name: string }) => string;

function getErrorMessage({ errorMessage, errorKey, name, errors: formikErrors, touched: formikTouched }) {
  const error = get(formikErrors, errorKey ?? name, "") as string;

  const touched = get(formikTouched, errorKey ?? name, false) as boolean;

  if (errorMessage) {
    return isFunction(errorMessage) ? errorMessage({ touched, error, name }) : errorMessage;
  }

  return isPlainObject(error) ? JSON.stringify(error) : error || "";
}

interface RequiredComponentProps {
  onChange?(value: any): void;
}

export function withFormInternal<ComponentProps extends RequiredComponentProps>(
  Component: React.ComponentType<ComponentProps>,
  ErrorMessage: React.FC<React.PropsWithChildren> = ErrorMessageComponent,
): React.ComponentType<ComponentProps & InternalFormFieldProps> {
  function FormElement(props: ComponentProps & InternalFormFieldProps) {
    const { name, formik } = props;

    React.useEffect(() => {
      if (props.defaultValue) {
        formik?.setFieldValue(props.name, props.defaultValue);
      }
    }, []);

    function onChangeHandler(...[data]: any) {
      // We want to prevent setting of form state while form is submitting
      if (formik.isSubmitting) {
        return;
      }

      const { onChange } = props;

      if (!formik?.validateOnChange && !props.validateOnChange && get(formik?.errors, name)) {
        formik?.setErrors(omit(formik?.errors, [name]));
        formik?.setFieldTouched(name, false);
      }

      const value = data?.target?.value ?? data;

      formik?.setFieldValue(name, value);

      isFunction(onChange) && onChange(value);

      setTimeout(() => {
        props.validateOnChange && formik?.validateField(name);

        if (props.submitOnChange) {
          formik?.submitForm();
        }
      }, 500);
    }

    function onBlurHandler(event: SyntheticEvent) {
      const { onBlur = noop, name, formik } = props;

      formik?.handleBlur(name)(event);

      isFunction(onBlur) && onBlur(event);

      setTimeout(() => {
        props.validateOnBlur && formik?.validateField(name);
      });
    }

    const errorMessage = getErrorMessage({
      errorMessage: props.errorMessage,
      errorKey: props.errorKey,
      name,
      errors: formik?.errors,
      touched: formik?.touched,
    });

    const injectedComponentProps: InjectedFormElementProps = {
      name,
      onChange: onChangeHandler,
      onBlur: onBlurHandler,
      value: get(formik?.values, name),
      touched: Boolean(get(formik?.touched, name)),
      invalid: Boolean(errorMessage),
      errorMessage: errorMessage,
      wasSubmitted: formik?.submitCount && formik?.submitCount > 0,
    };

    const componentProperties = {
      ...props,
      ...injectedComponentProps,
    };

    return (
      <Container>
        <Component {...componentProperties} withForm />
        {/*
          Form wizard is figuring out all the form elements that belong to specific step based on the present element in dom with name attribute
          For example Select will not have name attribute, so we need to add hidden input with name attribute to make it work.
          Also, we need to add hidden input for all the form elements that are not input, option group or option.
          In case of input component this will be a duplicate but it will not affect the functionality.
        */}

        <input name={name} value={get(formik.values, name)} hidden readOnly />

        <If condition={Boolean(errorMessage)}>
          <ErrorMessage>{errorMessage}</ErrorMessage>
        </If>
      </Container>
    );
  }

  return FormElement;
}

export default function withForm<ComponentProps extends RequiredComponentProps, StaticTypes = object>(
  Component: React.ComponentType<ComponentProps>,
  ErrorMessage?: React.ComponentType<ComponentProps & InternalFormFieldProps>,
): React.ComponentType<ComponentProps & InternalFormFieldProps> & StaticTypes {
  return hoistNonReactStatics(
    withForwardRef<HTMLFormElement, ComponentProps & InternalFormFieldProps>(
      connect<ComponentProps>(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        withFormInternal<ComponentProps>(Component, ErrorMessage),
      ),
    ),
    Component,
  );
}
