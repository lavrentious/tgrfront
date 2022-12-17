export function removeCookie(name: string) {
  document.cookie = name + "=; Max-Age=0";
}
