/**
 * JSON.stringify 不會逸出 `<`，標題裡只要出現 `</script>` 就會提前關掉
 * `<script type="application/ld+json">`，讓結構化資料變成頁面上的純文字。
 */
export function stringifyJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
