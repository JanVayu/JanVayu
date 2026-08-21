// ESLint flat config — the only config format ESLint 9 reads.
//
// The rules below used to live as a dozen `--rule` flags in
// .github/workflows/quality.yml, alongside `--no-eslintrc`. ESLint 9 removed
// that flag, so the command died on startup ("Invalid option '--eslintrc'"),
// `|| true` swallowed the failure, and the summary step found no "N problems"
// line and reported nothing. The job had been green without linting a single
// file. Keeping the rules in the repo means the same lint runs in CI and on a
// contributor's machine, and a future flag rename cannot silently disable it.
//
// Advisory by design: everything is a warning, so lint never blocks a merge.
// `no-undef` stays off because these files run in several environments
// (Netlify functions, browser service workers, Node scripts) without a shared
// globals declaration.
export default [
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'off',
      'no-unreachable': 'warn',
      'no-dupe-keys': 'warn',
      'no-dupe-args': 'warn',
      'no-irregular-whitespace': 'warn',
      'no-misleading-character-class': 'warn',
      'no-self-assign': 'warn',
      'no-unsafe-finally': 'warn',
      'no-with': 'warn',
      'use-isnan': 'warn',
    },
  },
];
