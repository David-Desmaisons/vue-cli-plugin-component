module.exports = (api, { componentName, useVueStyleguidist }) => {

  api.extendPackage({
    name: componentName,
    main: `dist/${componentName}.umd.js`,
    module: `dist/${componentName}.common.min.js`,
    files: [
      "dist/*.css",
      "dist/*.map",
      "dist/*.js",
      `src/*`
    ],
    scripts: {
      serve: "vue-cli-service serve ./example/main.js --open",
      build: `vue-cli-service build --name ${componentName} --entry ./src/index.js --target lib --modern`,
    },
    private: false,
    keywords: [
      "vue",
      "component"
    ]
  })

  if (useVueStyleguidist) {
    api.extendPackage({
      scripts: {
        styleguide: "vue-styleguidist server", 
        'styleguide:build': "vue-styleguidist build"
      },
      devDependencies: {
        'vue-styleguidist': "^1.7.13",
      }
    })
  }

  api.render('./template')

  api.postProcessFiles(files => {
    const hasTest = api.hasPlugin('unit-mocha') || api.hasPlugin('unit-jest')
    const { renameFiles, updateFile } = require('./fileHelper')
    if (hasTest) {
      updateFile(files, 'tests/unit/HelloWorld.spec.js', content =>  content.replace(/HelloWorld/g, componentName))
    }

    const immutableFiles = ['src/components/HelloWorld.vue', 'src/index.js']
    renameFiles(files, /^src\//, 'example/', (file) => immutableFiles.indexOf(file) !== -1)
    renameFiles(files, /\/HelloWorld\./, `/${componentName}.`)
  })
}
