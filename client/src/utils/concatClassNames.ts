export const concatClassNames = (...classNames: Array<string | undefined>) => {
  return classNames.filter((cn) => !!cn).join(" ");
}