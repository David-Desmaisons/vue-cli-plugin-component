module.exports = (api, config) => {

  api.extendPackage({
    scripts: {
      serve: "vue-cli-service serve ./example/main.js --open",
      build: "vue-cli-service build --target lib ./src/index.js",
    },
    private: false,
    files: [
      "dist/*.css",
      "dist/*.map",
      "dist/*.js",
    ]
  })

  api.render('./template')

  api.postProcessFiles(files => {
    const sourceFiles = /^src\//
    const immutableFiles = ['src/components/HelloWorld.vue', 'src/index.js']

    for (const file in files) {
      if (!sourceFiles.test(file) || immutableFiles.indexOf(file) !== -1) {
        continue;
      }
      const migratedFile = file.replace(sourceFiles, 'example/');
      files[migratedFile] = files[file];
      delete files[file];
    }
  })
}
