/**
 * Immutable String.replaceAll (literally)
 *
 * ```js
 * const foo = replaceAll("/@@bar/@@aux/@@bar", { bar: 'qux' }, (key) => `@@${key}`)
 * console.log(foo)
 * // -> "/qux/@@aux/qux"
 * ```
 *
 * @author Kirk
 */

export const replaceAll = (
  template: string,
  values: Record<string, PrimitiveType>,
  pattern: (key: string) => string = (key) => key,
) => {
  let parsedTemplate = template;
  if (values) {
    Object.entries(values).forEach(([k, v]) => {
      const matched = template.matchAll(
        new RegExp(typeof pattern === 'function' ? pattern(k) : pattern, 'g'),
      );
      if (matched) {
        Array.from(matched).forEach(([match]) => {
          parsedTemplate = parsedTemplate.replace(match, String(v));
        });
      }
    });
  }
  return parsedTemplate;
};

/**
 * Get nickname's captial, supporting Chi & Eng
 *
 * @author Kirk
 */
export function getNicknameCapital(nickname: string | null) {
  if (!nickname) {
    return null;
  }
  if (isChineseCharacters(nickname) && nickname.length < 5) {
    return nickname.substr(-2);
  }
  if (isLatinCharacters(replaceAll(nickname, { ' ': '' }))) {
    const nameGroup = nickname.toUpperCase().split(' ');
    let capital = nameGroup[0].charAt(0);
    if (nameGroup.length > 1) {
      capital += nameGroup[nameGroup.length - 1].charAt(0);
    }
    return capital;
  }
  return null;
}

export function isChineseCharacters(text: string | null, partial?: boolean) {
  const reg = new RegExp(partial ? '[\u4e00-\u9fa5]+' : '^[\u4e00-\u9fa5]+$');
  return text ? reg.test(text) : false;
}

export function isLatinCharacters(text: string | null, partial?: boolean) {
  const reg = new RegExp(partial ? '[a-zA-Z]+' : '^[a-zA-Z]+$');
  return text ? reg.test(text) : false;
}
