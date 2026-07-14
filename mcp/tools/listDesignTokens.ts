import { IMAGE_PATH_PREFIXES, THEMES, VIDEO_DOMAIN_ALLOWLIST } from '../../src/component-library/tokens'

export function listDesignTokens() {
  return {
    themes: THEMES,
    videoDomainAllowlist: VIDEO_DOMAIN_ALLOWLIST,
    imagePathPrefixes: IMAGE_PATH_PREFIXES,
  }
}
