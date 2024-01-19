export function captialize(word: string) {
  return word.charAt(0).toUpperCase()+word.substring(1)
}
export function adjustName(name: string) {
  return name.split("-").map((word) => captialize(word)).join(" ")
}

export function padZero(number: number) {
  switch (true) {
    case (number<10):
      return `00${number}`
    case (number>9 && number<100):
      return `0${number}`
    default:
      return `${number}`
  }
}

export function hyphenate(title: string) {
  return title?.replace(/['!"#$%&\\'()\*+,\-\.\/:;<=>?@\[\\\]\^_`{|}~']/g,"").toLowerCase().split(" ").join("-") || ""
}