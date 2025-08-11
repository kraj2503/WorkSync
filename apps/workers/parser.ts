export function Parse(
  text: string,
  values: Record<string, any>,
  startDelimeter = "{",
  endDelimeter = "}"
): string {
  let result = "";
  let i = 0;

  while (i < text.length) {
    if (text[i] === startDelimeter) {
      let endPoint = i + 1;

      while (endPoint < text.length && text[endPoint] !== endDelimeter) {
        endPoint++;
      }

      if (endPoint >= text.length) {
        throw new Error("Unmatched start delimiter");
      }

      const stringHoldingValue = text.slice(i + 1, endPoint);
      const keys: string[] = stringHoldingValue.split(".");

      let localValue: any = values;

      for (let j = 0; j < keys.length; j++) {
        const key = keys[j];

        // Special handling for top-level "comments" JSON string
        if (
          j === 0 &&
          key === "comments" &&
          typeof localValue[key] === "string"
        ) {
          try {
            localValue = JSON.parse(localValue[key]);
            continue;
          } catch {
            localValue = {};
            break;
          }
        }

        if (localValue && typeof localValue === "object" && key in localValue) {
          localValue = localValue[key];
        } else {
          localValue = undefined;
          break;
        }
      }

      result += localValue ?? "";
      i = endPoint + 1;
    } else {
      result += text[i];
      i++;
    }
  }

  return result;
}
