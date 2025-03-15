import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["src/**/*.{js,mjs,cjs,ts}"], // Proverava sve JavaScript i TypeScript fajlove
    languageOptions: {
      globals: {
        ...globals.node, // Dodaje Node.js globalne promenljive (npr. `module`, `require`, `__dirname`, itd.)
      },
      parser: tseslint.parser, // Koristi TypeScript parser
      parserOptions: {
        ecmaVersion: "latest", // Koristi najnoviju verziju ECMAScript
        sourceType: "module", // Omogućava korišćenje ES modula
        project: "./tsconfig.json", // Ukazuje na tvoj TypeScript konfiguracioni fajl
      },
    },
    rules: {
      // Pravila za TypeScript
      "@typescript-eslint/explicit-function-return-type": "warn", // Zahteva eksplicitne tipove povratnih vrednosti funkcija
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
            "argsIgnorePattern": "^_",  // Ignoriši neiskorišćene argumente koji počinju sa _
            "varsIgnorePattern": "^_",  // Ignoriši neiskorišćene promenljive koje počinju sa _
            "caughtErrorsIgnorePattern": "^_"  // Ignoriši neiskorišćene catch promenljive koje počinju sa _
        }
      ],
      "@typescript-eslint/no-explicit-any": "warn", // Upozorava na korišćenje `any` tipa

      // Opšta pravila
      "quotes": ["error", "single"], // Koristi jednostruke navodnike
      "semi": ["error", "always"], // Zahteva tačku-zarez na kraju izraza
      "indent": ["error", 4], // Uvlačenje od 4 razmaka
      "no-console": "off", // Upozorava na korišćenje `console.log`
      "no-unused-vars": [
        "error",
        {
            "argsIgnorePattern": "^_",  // Ignoriši neiskorišćene argumente koji počinju sa _
            "varsIgnorePattern": "^_",  // Ignoriši neiskorišćene promenljive koje počinju sa _
            "caughtErrorsIgnorePattern": "^_"  // Ignoriši neiskorišćene catch promenljive koje počinju sa _
        }
      ],
      "prefer-const": "error", // Preporučuje korišćenje `const` umesto `let` gde god je moguće
      "eqeqeq": ["error", "always"], // Zahteva strogu jednakost (`===` umesto `==`)
      "no-trailing-spaces": "error", // Zabranjuje prazne prostore na kraju linija
      "eol-last": ["error", "always"], // Zahteva praznu liniju na kraju fajla
      "no-multi-spaces": 'warn',
    },
  },
  ...tseslint.configs.recommended, // Dodaje preporučena pravila za TypeScript
];
