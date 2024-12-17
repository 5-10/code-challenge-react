export type TruncatePosition = "start" | "middle" | "end"
export function truncate(
  text: string,
  maxLength: number,
  position: TruncatePosition = "middle",
  separator: string = "...",
): string {
  if (text.length <= maxLength) {
    return text;
  }

  const separatorLength = separator.length;
  const charsToDisplay = maxLength - separatorLength;

  let truncatedString: string = "";

  switch (position) {
    case "start":
      truncatedString = `${separator}${text.substr(0, charsToDisplay)}`;
      break;
    case "end":
      truncatedString = `${text.substr(0, charsToDisplay)}${separator}`;
      break;
    default:
      const initialChars = Math.ceil(charsToDisplay / 2);
      const endingChars = Math.floor(charsToDisplay / 2);
      truncatedString = `${text.substr(0, initialChars)}${separator}${text.substr(text.length - endingChars)}`;
  }

  return truncatedString;
}
