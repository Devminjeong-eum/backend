module.exports = {
  semi: true,
  useTabs: true,
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 4,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: [
      "^@nestjs(?!$)",
      "<THIRD_PARTY_MODULES>",
      "^@(?=.*)(?!$)",
      "^../(?=.*)(?!$)",
      "^./(?=.*)(?!$)|^./?$"
  ],
  importOrderParserPlugins: ["typescript", "decorators-legacy"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true
}
