module.exports = {
  extends: 'next/core-web-vitals',
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', {
      varsIgnorePattern: '^(useEffect|Moon|Sun|Filter|FiBox)$',
      argsIgnorePattern: '^_'
    }],
    'react/no-unescaped-entities': 'off'
  }
}
