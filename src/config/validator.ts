export const getParamsErrorMessages = (name: string) => ({
  "string.base": `${name}_error`,
  "string.empty": `empty_${name}_error`,
  "string.alphanum": `${name}_error`,
  "any.only": `${name}_error`,
  "any.required": `required_${name}`,
  "string.pattern.base": `${name}_format_error`,
  "object.unknown": `${name}_unknown_error`,
});

export const patternEmail = RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
export const datePattern = RegExp(/^\d{4}-\d{2}-\d{2}$/);
