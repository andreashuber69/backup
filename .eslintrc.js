// https://github.com/andreashuber69/net-worth#--
module.exports = {
    env: {
        browser: true,
        es2017: true
    },
    extends: [
        "eslint:all",
        "plugin:@typescript-eslint/all"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "tsconfig.json",
        sourceType: "module"
    },
    plugins: [
        "@typescript-eslint",
        "import",
        "jsdoc",
        "no-null",
        "prefer-arrow",
    ],
    root: true,
    rules: {
        "array-element-newline": [
            "error",
            "consistent"
        ],
        "@typescript-eslint/array-type": [
            "error",
            {
                default: "array-simple",
            }
        ],
        "camelcase": "off",
        "@typescript-eslint/camelcase": [
            "error",
            {
                properties: "always"
            }
        ],
        "capitalized-comments": [
            "error",
            "always",
            {
                "ignoreConsecutiveComments": true,
                "ignoreInlineComments": true,
                "ignorePattern": "cSpell|codebeat"
            }
        ],
        "comma-dangle": [
            "error",
            "always-multiline"
        ],
        "@typescript-eslint/consistent-type-assertions": [
            "error",
            {
                assertionStyle: "as",
                objectLiteralTypeAssertions: "never",
            }        
        ],
        "@typescript-eslint/consistent-type-definitions": "off", // We want to use both interfaces and types.
        // cSpell: ignore eqeqeq
        "eqeqeq": [
            "error",
            "always"
        ],
        // Leads to a lot of duplication without clear advantages. If types are necessary for documentation purposes,
        // @typescript-eslint/explicit-module-boundary-types would be preferable.
        "@typescript-eslint/explicit-function-return-type": "off",
        // Could make sense for larger projects with multiple developers, seems overkill for small projects.
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "function-call-argument-newline": [
            "error",
            "consistent"
        ],
        "function-paren-newline": [
            "error",
            "multiline-arguments"
        ],
        "id-blacklist": "off", // Often, e.g. "error" is a perfectly acceptable identifier.
        "id-length": "off", // Seems too restrictive, sometimes one character is enough (e.g. for inline arrows).
        "import/default": "off", // Already covered by typescript.
        // cSpell: ignore chunkname
        "import/dynamic-import-chunkname": "error",
        "import/export": "off", // Already covered by typescript.
        "import/exports-last": "error",
        "import/extensions": [
            "error",
            {
                "json": "always",
                "schema": "always"
            }
        ],
        "import/first": "error",
        // There are advantages and disadvantages to turning this on or off. "off" seems the better choice.
        "import/group-exports": "off",
        "import/max-dependencies": [
            "error",
            {
                max: 30
            }
        ],
        "import/named": "off", // Already covered by typescript.
        "import/namespace": "off", // Already covered by typescript.
        "import/newline-after-import": "error",
        "import/no-absolute-path": "error",
        "import/no-amd": "error",
        "import/no-anonymous-default-export": [
            "error",
            {
                "allowArray": false,
                "allowArrowFunction": false,
                "allowAnonymousClass": false,
                "allowAnonymousFunction": false,
                "allowCallExpression": false,
                "allowLiteral": false,
                "allowObject": false
            }
        ],
        "import/no-commonjs": "error",
        "import/no-cycle": "error",
        "import/no-default-export": "error",
        "import/no-deprecated": "error",
        "import/no-duplicates": "error",
        "import/no-dynamic-require": "error",
        "import/no-extraneous-dependencies": "error",
        "import/no-internal-modules": "off", // Seems too restrictive.
        "import/no-mutable-exports": "error",
        "import/no-named-as-default": "error",
        "import/no-named-as-default-member": "error",
        "import/no-named-default": "error",
        "import/no-named-export": "off", // Does not make sense.
        "import/no-namespace": "error",
        "import/no-nodejs-modules": "error",
        "import/no-relative-parent-imports": "off", // Seems too restrictive.
        "import/no-restricted-paths": "off", // Seems too restrictive.
        "import/no-self-import": "error",
        "import/no-unassigned-import": "error",
        "import/no-unresolved": "off", // Already covered by typescript.
        "import/no-unused-modules": "error",
        "import/no-useless-path-segments": "error",
        "import/no-webpack-loader-syntax": "error",
        "import/order": [
            "error",
            {
                alphabetize: {
                    order: "asc",
                    caseInsensitive: true
                }
            }
        ],
        "import/prefer-default-export": "off", // Does not make much sense.
        "import/unambiguous": "error",
        "indent": "off",
        "@typescript-eslint/indent": [
            "error",
            4,
            {
                SwitchCase: 1
            }
        ],
        "@typescript-eslint/interface-name-prefix": [
            "error",
            {
                prefixWithI: "always"
            }
        ],
        "jsdoc/check-alignment": "warn",
        "jsdoc/check-examples": "warn",
        "jsdoc/check-indentation": [
            "warn",
            {
                excludeTags: ["description"]
            }
        ],
        "jsdoc/check-param-names": "warn",
        "jsdoc/check-syntax": "warn",
        "jsdoc/check-tag-names": [
            "warn",
            {
                "definedTags": ["internal", "maximum", "minimum", "multipleOf"]
            }
        ],
        "jsdoc/check-types": "warn",
        "jsdoc/match-description": "warn",
        "jsdoc/newline-after-description": "warn",
        "jsdoc/no-types": "warn",
        "jsdoc/require-description-complete-sentence": "warn",
        "jsdoc/require-param-description": "warn",
        "jsdoc/require-param-name": "warn",
        "jsdoc/require-returns-check": "warn",
        "jsdoc/require-returns-description": "warn",
        "jsdoc/valid-types": "warn",
        "line-comment-position": "off", // We want to allow comments above and beside code.
        // Does not work with interfaces, see https://github.com/typescript-eslint/typescript-eslint/issues/1150
        "lines-around-comment": "off",        
        "lines-between-class-members": [
            "error",
            "always",
            {
                exceptAfterSingleLine: true
            }
        ],
        "max-len": [
            "error",
            {
                code: 120
            }
        ],
        "max-lines": [
            "error",
            1000
        ],
        "max-lines-per-function": "off", // Does not make much sense for describe-style tests.
        "max-params": "off",
        "max-statements": "off", // Does not make much sense for describe-style tests.
        "@typescript-eslint/member-ordering": [
            "error",
            {
                default: [
                    'signature',
                  
                    'public-static-field',
                    'public-static-method',
                    'public-field',
                    'public-constructor',
                    'public-method',
                  
                    'protected-static-field',
                    'protected-static-method',
                    'protected-field',
                    'protected-constructor',
                    'protected-method',
                  
                    'private-static-field',
                    'private-static-method',
                    'private-field',
                    'private-constructor',
                    'private-method'
                ]
            }
        ],
        "multiline-comment-style": [
            "error",
            "separate-lines"
        ],
        "multiline-ternary": [
            "error",
            "always-multiline"
        ],
        // Typescript ensures that constructor functions are only called with new, so the convention is not necessary.
        "new-cap": "off",
        "newline-per-chained-call": "off", // This rule seems too restrictive.
        // Typescript already catches many of the bugs that this rule would because bitwise operators are not allowed
        // for booleans.
        "no-bitwise": "off",
        "no-extra-parens": "off", // Was turned off in favor of no-mixed-operators.
        "@typescript-eslint/no-extra-parens": "off", // Was turned off in favor of no-mixed-operators.
        "@typescript-eslint/no-extraneous-class": [
            "error",
            {
                allowStaticOnly: true
            }
        ],
        "no-inline-comments": "off", // We want to allow inline comments.
        // Does not work for all cases in typescript https://github.com/typescript-eslint/typescript-eslint/issues/491.
        "no-invalid-this": "off",
        "no-magic-numbers": "off", // Makes sense but appears to be too restrictive.
        "@typescript-eslint/no-magic-numbers": "off", // Makes sense but appears to be too restrictive.
        "no-null/no-null": "error",
        "@typescript-eslint/no-parameter-properties": "off", // The value of this rule seems dubious at best.
        // cSpell: ignore plusplus
        // Most of the problems with the ++ and -- operators are avoided because we've turned on 
        // @typescript-eslint/semi.
        "no-plusplus": "off",
        "no-restricted-syntax": [
            "error",
            "ForInStatement"
        ],
        "no-shadow": [
            "error",
            {
                hoist: "all"
            }
        ],
        "no-ternary": "off",
        "@typescript-eslint/no-type-alias": "off", // Does not make much sense.
        "no-undef": "off", // Does not make sense with typescript-only code.
        // Does not make sense for js code >= ES5 with no-global-assign and no-shadow-restricted-names turned on.
        "no-undefined": "off",
        "@typescript-eslint/no-unnecessary-condition": "off", // Flags expressions like `... || "Error"`.
        "@typescript-eslint/no-unused-vars-experimental": "off", // Turned off in favor of no-unused-vars.
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": [
            "error",
            {
                functions: false,
                // cSpell: ignore typedefs
                typedefs: false,
                enums: false
            },
        ],
        // Was turned off in favor of @typescript-eslint/no-useless-constructor (which is turned on with default
        // settings).
        "no-useless-constructor": "off",
        // cSpell: ignore todos
        "no-warning-comments": "off", // Turn this on after tackling TODOs ;-)?.
        "object-curly-spacing": [
            "error",
            "always"
        ],
        "object-property-newline": [
            "error",
            {
                allowAllPropertiesOnSameLine: true
            }
        ],
        "one-var": "off", // Does not seem to work with const and let?
        // cSpell: ignore linebreak
        "operator-linebreak": [
            "error",
            "after"
        ],
        "padded-blocks": [
            "error",
            "never"
        ],
        "padding-line-between-statements": [
            "error",
            {
                blankLine: "always",
                prev: "*",
                next: "return"
            }
            // TODO: Configure to match code style
        ],
        "prefer-arrow/prefer-arrow-functions": [
            "error",
            {
                "disallowPrototype": true,
                "singleReturnOnly": false,
                "classPropertiesAllowed": false
            }
        ],
        "quote-props": [
            "error",
            "consistent-as-needed"
        ],
        "quotes": "off", // Turned off in favor of @typescript-eslint/quotes (which is turned on with default settings)
        "@typescript-eslint/restrict-template-expressions": "off", // The advantages are unclear.
        "semi": "off", // Turned off in favor of @typescript-eslint/semi (which is turned on with default settings)
        "sort-imports": [
            "error",
            {
                "ignoreCase": true,
                "ignoreDeclarationSort": true,
            }
        ],
        "sort-keys": "off", 
        "space-before-function-paren": "off",
        "@typescript-eslint/space-before-function-paren": [
            "error",
            {
                anonymous: "never",
                named: "never",
                asyncArrow: "always"
            }
        ],
        "space-in-parens": [
            "error",
            "never"
        ],
        "spaced-comment": [
            "error",
            "always",
            {
                exceptions: ["/"]
            }
        ],
        "@typescript-eslint/strict-boolean-expressions": "off", // Takes away too much expressive power.
        // Value is questionable, see
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/typedef.md
        "@typescript-eslint/typedef": "off"
    },
    settings: {
        jsdoc: {
            mode: "typescript"
        }
    }
};
