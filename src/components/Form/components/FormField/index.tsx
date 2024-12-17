import TextInput from "@/components/TextInput";

export enum FieldType {
  TextInput = "textInput",
}

export const Fields = {
  [FieldType.TextInput]: TextInput,
};
