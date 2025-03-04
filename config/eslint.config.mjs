import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import typescriptEslintEslintPlugin from "@typescript-eslint/eslint-plugin";
import _import from "eslint-plugin-import";
import jsdoc from "eslint-plugin-jsdoc";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import stylisticTs from '@stylistic/eslint-plugin-ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/.eslintrc.js", "**/migrations/*.ts", "**/migrations-old/*.ts"],
}, ...fixupConfigRules(compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
)), {
    plugins: {
        '@stylistic/ts': stylisticTs,
        "@typescript-eslint": fixupPluginRules(typescriptEslintEslintPlugin),
        import: fixupPluginRules(_import),
        jsdoc,
    },

    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.jest,
        },

        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "module",

        parserOptions: {
            project: "../tsconfig.json",
            tsconfigRootDir: "./config",
        },
    },

    rules: {
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",

        "@typescript-eslint/naming-convention": ["error", {
            selector: "typeLike",
            format: ["PascalCase"],
        }, {
            selector: "enumMember",
            format: ["PascalCase", "UPPER_CASE"],
        }, {
            selector: "variable",
            format: ["PascalCase", "camelCase", "UPPER_CASE"],
            leadingUnderscore: "allow",
        }, {
            selector: "classProperty",
            modifiers: ["static"],
            format: ["UPPER_CASE"],
        }],

        "@typescript-eslint/array-type": "warn",
        "@typescript-eslint/consistent-type-assertions": "error",
        "@typescript-eslint/dot-notation": "error",

        "@stylistic/ts/member-delimiter-style": ["error", {
            multiline: {
                delimiter: "semi",
                requireLast: true,
            },

            singleline: {
                delimiter: "semi",
                requireLast: false,
            },
        }],

        "@typescript-eslint/member-ordering": "error",
        "@typescript-eslint/no-explicit-any": "off",
        '@typescript-eslint/no-empty-object-type': 'off',
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/no-inferrable-types": "error",

        "@typescript-eslint/no-misused-promises": ["error", {
            checksVoidReturn: false,
        }],

        "@typescript-eslint/no-parameter-properties": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": "error",
        "@typescript-eslint/no-unused-expressions": "error",
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/no-var-requires": 0,
        "@typescript-eslint/prefer-for-of": "error",
        "@typescript-eslint/prefer-readonly": "warn",
        "@stylistic/ts/quotes": ["error", "single"],
        "@stylistic/ts/semi": "error",

        "@typescript-eslint/triple-slash-reference": ["error", {
            path: "never",
            types: "never",
            lib: "never",
        }],

        "@stylistic/ts/type-annotation-spacing": "error",

        "@typescript-eslint/unbound-method": ["error", {
            ignoreStatic: true,
        }],

        "@typescript-eslint/unified-signatures": "error",

        "comma-dangle": ["error", {
            arrays: "always-multiline",
            objects: "always-multiline",
            imports: "always-multiline",
            exports: "always-multiline",
            functions: "ignore",
        }],

        "id-blacklist": "off",
        "import/no-unresolved": "off",
        "import/no-named-as-default": "off",
        "jsdoc/check-alignment": "error",
        "jsdoc/check-indentation": "error",
        "jsdoc/no-types": "error",
        complexity: "warn",

        "max-len": ["warn", {
            code: 140,
        }],

        "no-bitwise": "error",
        "no-caller": "error",
        "no-cond-assign": "error",

        "no-console": ["warn", {
            allow: ["error", "group", "groupEnd", "groupCollapsed", "warn"],
        }],

        "no-empty-function": "off",
        "no-eval": "error",
        "no-fallthrough": "off",
        "no-new-wrappers": "error",
        "no-restricted-imports": ["error", "rxjs/Rx"],
        "no-throw-literal": "error",
        "no-undef-init": "error",
        "no-underscore-dangle": "off",
        "no-unused-vars": "off",
        "no-var": "error",
        "object-shorthand": ["error", "consistent"],
        "one-var": ["error", "never"],
        "prefer-const": "error",
        "quote-props": ["error", "as-needed"],
        radix: "error",

        "space-before-function-paren": ["error", {
            anonymous: "never",
            asyncArrow: "always",
            named: "never",
        }],

        "spaced-comment": ["error", "always"],
    },
}];