export function isEmail(string: string) {
  /**
   * @see https://emailregex.com/
   */
  const EMAIL_REGEX = new RegExp(
    '^(([^<>()\\[\\]\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$',
    'i',
  );
  return EMAIL_REGEX.test(string);
}
