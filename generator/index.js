module.exports = (api, config) => {

  api.extendPackage({
    scripts: {
      serve: "vue-cli-service serve ./example/main.js --open",
      build: "vue-cli-service build --target lib ./src/index.js",
    }
  })

  api.render('./template', {
    isTest: process.env.VUE_CLI_TEST || process.env.VUE_CLI_DEBUG,
    hasMocha,
    hasJest
  })

  api.postProcessFiles(files => {
    for (const file in files) {
      if (jsRE.test(file) && !excludeRE.test(file)) {
        const tsFile = file.replace(jsRE, '.ts')
        if (!files[tsFile]) {
          let content = files[file]
          if (tsLint) {
            content = convertLintFlags(content)
          }
          files[tsFile] = content
        }
        delete files[file]
      }
    }
  })
}
