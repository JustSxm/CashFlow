export function capitalize(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1).toLocaleLowerCase()
}

export function capitalizeOnlyFirstLetter(name: string): string {
  if (name.length === 0) return name
  return name.charAt(0).toUpperCase() + name.slice(1)
}
