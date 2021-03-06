/**************************************************************************
 * IMPORTS
 ***************************************************************************/

// NPM
import alias from "@rollup/plugin-alias"
import babel from "rollup-plugin-babel"
import commonjs from "rollup-plugin-commonjs"
import minimist from "minimist"
import replace from "rollup-plugin-replace"
import vue from "rollup-plugin-vue"
import { terser } from "rollup-plugin-terser"

/**************************************************************************
 * ROLLUP CONFIGURATION
 * https://rollupjs.org/guide/en/
 ***************************************************************************/

const argv = minimist(process.argv.slice(2))

const baseConfig = {
  input: "src/entry.js",
  plugins: {
    preVue: [
      alias({
        entries: {
          vue: "vue/dist/vue.esm"
        }
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("production")
      }),
      commonjs()
    ],
    vue: {
      css: true,
      template: {
        isProduction: true
      }
    },
    postVue: [babel()]
  }
}

// ESM/UMD/IIFE shared settings: externals
// Refer to https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency
const external = [
  // list external dependencies, exactly the way it is written in the import statement.
  "v-click-outside",
  "@lecoupa/v-hotkey",
  "v-hotkey",
  "vee-validate"
]

// UMD/IIFE shared settings: output.globals
// Refer to https://rollupjs.org/guide/en#output-globals for details
const globals = {
  "v-click-outside": "vClickOutside",
  "@lecoupa/v-hotkey": "LeCoupaVueHotkey",
  "v-hotkey": "VueHotkey",
  "vee-validate": "VeeValidate"
}

// Customize configs for individual targets
const buildFormats = []

if (!argv.format || argv.format === "es") {
  const esConfig = {
    ...baseConfig,
    external,
    output: {
      file: "dist/vuedarkmode.esm.js",
      format: "esm",
      exports: "named"
    },
    plugins: [
      ...baseConfig.plugins.preVue,
      vue(baseConfig.plugins.vue),
      ...baseConfig.plugins.postVue,
      terser({
        output: {
          ecma: 6
        }
      })
    ]
  }
  buildFormats.push(esConfig)
}

if (!argv.format || argv.format === "cjs") {
  const umdConfig = {
    ...baseConfig,
    external,
    output: {
      compact: true,
      file: "dist/vuedarkmode.ssr.js",
      format: "cjs",
      name: "Vuedarkmode",
      exports: "named",
      globals
    },
    plugins: [
      ...baseConfig.plugins.preVue,
      vue({
        ...baseConfig.plugins.vue,
        template: {
          ...baseConfig.plugins.vue.template,
          optimizeSSR: true
        }
      }),
      ...baseConfig.plugins.postVue
    ]
  }
  buildFormats.push(umdConfig)
}

if (!argv.format || argv.format === "iife") {
  const unpkgConfig = {
    ...baseConfig,
    external,
    output: {
      compact: true,
      file: "dist/vuedarkmode.min.js",
      format: "iife",
      name: "Vuedarkmode",
      exports: "named",
      globals
    },
    plugins: [
      ...baseConfig.plugins.preVue,
      vue(baseConfig.plugins.vue),
      ...baseConfig.plugins.postVue,
      terser({
        output: {
          ecma: 5
        }
      })
    ]
  }
  buildFormats.push(unpkgConfig)
}

/**************************************************************************
 * EXPORT
 ***************************************************************************/

export default buildFormats
