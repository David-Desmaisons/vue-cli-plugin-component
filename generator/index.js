const { renameFiles, updateFile } = require('./fileHelper')
const readmeUpdater = require('./readmeUpdater');
const licenseList = require('spdx-license-list/full');

function buildPrePublishOnly({ useVueStyleguidist, useVueDoc, useLint }) {
  let script = useLint ? 'npm run lint && ' : ''
  script += 'npm run build '
  if (useVueStyleguidist) {
    script += '&& npm run styleguide:build '
  }
  if (useVueDoc) {
    script += '&& npm run doc:build'
  }
  return script.trim()
}

function replaceInLicense(licenseTextTemplate, sourceText, newText){
  return licenseTextTemplate.replace(new RegExp(`<${sourceText}>`), newText)
                            .replace(new RegExp(`\\[${sourceText}\\]`), newText)
}
 
module.exports = (api, { addBadges, addLicense, componentName, copyrightHolders, licenseName, useVueDoc, useVueStyleguidist }) => {

  const useLint = api.hasPlugin('eslint')
  const context = { addBadges, addLicense, componentName, licenseName, useLint, useVueDoc, useVueStyleguidist }

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
      prepublishOnly: buildPrePublishOnly(context)
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

  if (useVueDoc) {
    api.extendPackage({
      scripts: {
        'doc:build': `npx vuedoc.md --section API --output ./README.md ./src/components/${componentName}.vue`
      },
      devDependencies: {
        '@vuedoc/md': "^1.3.3"
      }
    })
  }

  api.render('./template')

  api.postProcessFiles(files => {
    const hasTest = api.hasPlugin('unit-mocha') || api.hasPlugin('unit-jest')
    if (hasTest) {
      updateFile(files, 'tests/unit/HelloWorld.spec.js', content => content.replace(/HelloWorld/g, componentName))
    }

    updateFile(files, 'README.md', content => readmeUpdater(content, context))

    const immutableFiles = ['src/components/HelloWorld.vue', 'src/index.js']
    renameFiles(files, /^src\//, 'example/', (file) => immutableFiles.indexOf(file) !== -1)
    renameFiles(files, /\/HelloWorld\./, `/${componentName}.`)

    if (!addLicense) {
      return
    }

    const licenseTextTemplate = licenseList[licenseName].licenseText;
    const year = new Date().getFullYear()
    const licenseText = replaceInLicense(licenseTextTemplate, 'year', year)
    files['LICENSE'] = replaceInLicense(licenseText, 'copyright holders', copyrightHolders)
  })
}
