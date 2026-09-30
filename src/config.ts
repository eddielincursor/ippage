/** 換網域時改這裡。GitHub Pages 專案站要保留 basePath。 */
export const siteOrigin = 'https://eddielincursor.github.io';
export const basePath = '/ippage';
export const siteUrl = `${siteOrigin}${basePath}`;

export const site = {
  name: '知行',
  tagline: '把程式、金融和好書，整理成你用得上的筆記',
  description:
    '一份個人知識站：用程式設計解決實際問題、把金融觀念寫成入門路徑，並分享真正讀完、用過的好書。',
  author: '林知行',
  url: siteUrl,
  email: 'hello@example.com',
  locale: 'zh-Hant',
};

export type Topic = {
  slug: string;
  name: string;
  description: string;
  help: string;
  mark: string;
  color: string;
  /** 分類頁開頭的索引導讀，讓主題頁本身也值得被搜尋到。 */
  intro: string;
  /** 這個主題想回答的問題，同時做為頁面大綱。 */
  questions: string[];
};

export const topics: Topic[] = [
  {
    slug: 'programming',
    name: '程式設計',
    description: '把重複的事自動化、把複雜的觀念寫成走得完的步驟。偏實作，不堆名詞。',
    help: '想快速上手一項工具或語言，從能立刻用的範例開始。',
    mark: '程',
    color: '#1d4ed8',
    intro:
      '這裡收的是「我自己踩過、確定能跑」的做法：自動化日常雜事、把一個工具從不會用到會用、以及踩雷時怎麼判斷問題出在哪。不從語法教起，從你這週遇到的麻煩開始。',
    questions: [
      '重複的事該怎麼自動化，才不會寫完就沒再用？',
      '選語言和工具時，哪些條件才真的影響結果？',
      '教學文要寫到多細，之後的自己才看得懂？',
    ],
  },
  {
    slug: 'finance',
    name: '金融',
    description: '投資理財入門整理：先搞懂自己在買什麼，再決定要不要出手。',
    help: '剛開始學理財、不知道從哪一篇看起時，先走這條索引。',
    mark: '金',
    color: '#0f766e',
    intro:
      '投資理財的資訊太多、入口太雜，新手最常卡在「不知道該先看哪一篇」。這個分類刻意寫成一條路徑：先確認這筆錢的用途與風險，再去比較個別商品。不推薦標的，只整理判斷方式。',
    questions: [
      '這筆錢什麼時候要用，該放在什麼工具裡？',
      '我買的東西靠什麼賺錢、費用從哪裡扣？',
      '波動到什麼程度，會真的影響我的生活？',
    ],
  },
  {
    slug: 'books',
    name: '好書分享',
    description: '讀完才寫。重點不是書摘清單，是哪一段改變了我接下來的做法。',
    help: '時間有限、想找下一本值得讀的書，或想看別人怎麼把書用進生活。',
    mark: '書',
    color: '#c2410c',
    intro:
      '這裡不做書摘目錄。每篇只留「讀完之後我真的改掉的做法」，以及這本書在什麼情況下不適用。想找下一本書、或想知道一本熱門書值不值得你花時間，從這裡開始。',
    questions: [
      '這本書值得我花時間讀完嗎？',
      '讀完之後，下週可以實際改的是哪一件事？',
      '什麼情況下，這本書的方法反而會害你？',
    ],
  },
];

export function getTopic(slug: string): Topic | undefined {
  return topics.find((topic) => topic.slug === slug);
}
