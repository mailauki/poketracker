export function captialize(word: string) {
  return word.charAt(0).toUpperCase()+word.substring(1)
}
export function adjustName(name: string) {
  return name.split("-").map((word) => captialize(word)).join(" ")
}