export const capitalizeFirstLetter: ([first, ...rest]: string) => string = ([
  first,
  ...rest
]) => first.toUpperCase() + rest.join("");
