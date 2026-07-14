import { IMAGE_PATH_PREFIXES, THEMES, THEME_FONT_CSS_URLS, VIDEO_DOMAIN_ALLOWLIST } from '../../src/component-library/tokens'

export function listDesignTokens() {
  return {
    themes: THEMES,
    fontCssUrls: THEME_FONT_CSS_URLS,
    videoDomainAllowlist: VIDEO_DOMAIN_ALLOWLIST,
    imagePathPrefixes: IMAGE_PATH_PREFIXES,
  }
}
