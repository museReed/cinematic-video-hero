import { IMAGE_PATH_PREFIXES, THEME_TOKENS, VIDEO_DOMAIN_ALLOWLIST } from '../../src/component-library/tokens'

export function listDesignTokens() {
  return {
    theme: THEME_TOKENS,
    allowlists: {
      videoDomains: VIDEO_DOMAIN_ALLOWLIST,
      imagePathPrefixes: IMAGE_PATH_PREFIXES,
    },
  }
}
