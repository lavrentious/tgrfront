export function cookieExists(cookie: string): boolean {
  return !!document.cookie.match(
    RegExp(`^(.*;)?\\s*${cookie}\\s*=\\s*[^;]+(.*)?$`)
  );
}
