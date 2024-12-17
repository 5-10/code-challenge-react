import React from "react";
import If from "@/components/If/If";
import useTextInput, { TextInputProps } from "@/components/TextInput/hooks/use-text-input";
import withForwardRef from "@/hoc/withForwardRef";
import { Container, InputContainer, StyledLabel, StyledInput, Description, WordCount } from "./style";
import { Row } from "@/components/Layout";
import Tooltip from "@/components/Tooltip";

export type { TextInputProps } from "@/components/TextInput/hooks/use-text-input";

export function TextInput(props: TextInputProps): JSX.Element {
  const {
    inputProps,
    LeftIcon,
    RightIcon,
    hasLeftIcon,
    hasRightIcon,
    inputRef,
    onInputContainerClick,
    isFocused,
    wordCount,
    tooltip,
  } = useTextInput(props);

  return (
    <Container hidden={props.hidden}>
      {props.label && (
        <Row spaceBetween alignItems="center">
          <StyledLabel invalid={props.invalid} required={props.required}>
            {props.label}{" "}
            <If condition={Boolean(tooltip)}>
              <Tooltip text={tooltip} className="w-64 px-6 py-8 bg-textureGlandhalf" />
            </If>
          </StyledLabel>
          <WordCount>
            <If condition={props.maxLength}>
              <If.Then>
                {wordCount}/{props.maxLength}
              </If.Then>
              {/*<If.Else>{Boolean(wordCount) && wordCount}</If.Else>*/}
            </If>
          </WordCount>
        </Row>
      )}
      <InputContainer
        isFocused={isFocused}
        invalid={Boolean(props.invalid)}
        disabled={Boolean(props.disabled)}
        onClick={onInputContainerClick}
        STORYBOOK_mockHoverState={props.STORYBOOK_mockHoverState}
        STORYBOOK_mockFocusState={props.STORYBOOK_mockFocusState}
      >
        {hasLeftIcon && LeftIcon}
        <StyledInput ref={inputRef} {...inputProps} STORYBOOK_mockFocusState={props.STORYBOOK_mockFocusState} />
        {hasRightIcon && RightIcon}
      </InputContainer>
      <If condition={props.description}>
        <Description>{props.description}</Description>
      </If>
    </Container>
  );
}

export default withForwardRef<HTMLInputElement, TextInputProps>(TextInput);
