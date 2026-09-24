// 用户语言检测（无第三方依赖）
//
// 用途：
// 1. 地图底图按语言自动选择（中文用户 → 高德，非中文 → 谷歌）
// 2. 提示文案按语言选择中/英版本
//
// 优先级：URL 参数 ?lang= > localStorage > 浏览器语言 > 默认中文

const STORAGE_KEY = 'dfr_user_lang'

/**
 * 返回归一化语言标识：'zh' 或 'en'
 */
export function detectLocale() {
  // 1. URL 参数强制指定（便于演示切换：?lang=en）
  try {
    const urlLang = new URLSearchParams(window.location.search).get('lang')
    if (urlLang) {
      const normalized = normalize(urlLang)
      localStorage.setItem(STORAGE_KEY, normalized)
      return normalized
    }
  } catch (e) {
    // 忽略解析异常
  }

  // 2. 用户此前的选择
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'zh' || stored === 'en') {
    return stored
  }

  // 3. 浏览器语言
  const browserLang =
    (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    navigator.userLanguage ||
    ''

  return normalize(browserLang)
}

/**
 * 是否中文用户
 */
export function isChineseLocale() {
  return detectLocale() === 'zh'
}

/**
 * 手动设置语言（预留给语言切换器）
 */
export function setLocale(lang) {
  const normalized = normalize(lang)
  localStorage.setItem(STORAGE_KEY, normalized)
  return normalized
}

/**
 * 在中英文本之间挑选。英文缺失时回退中文，避免出现空白。
 */
export function pickText(zhText, enText) {
  if (detectLocale() === 'en') {
    return enText || zhText || ''
  }
  return zhText || enText || ''
}

function normalize(lang) {
  return String(lang).toLowerCase().startsWith('zh') ? 'zh' : 'en'
}
