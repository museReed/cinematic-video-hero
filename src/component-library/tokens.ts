export const VIDEO_DOMAIN_ALLOWLIST = ['d8j0ntlcm91z4.cloudfront.net'] as const

export const IMAGE_PATH_PREFIXES = ['/characters/'] as const

export const Z_LAYERS = {
  content: 10,
  panel: 30,
  chrome: 50,
} as const

export { buildThemeCss, MOTION, THEMES, THEME_FONT_CSS_URLS, type ThemeId } from './themes'
