/** 畫面日期固定用台北時區，避免建置機器在 UTC-8 時少一天。 */
export const displayTimeZone = 'Asia/Taipei';

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-Hant', {
    timeZone: displayTimeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).format(date);
}
