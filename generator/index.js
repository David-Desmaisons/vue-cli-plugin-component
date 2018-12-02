const { renameFiles, updateFile } = require('./fileHelper')
const { updateExample } = require('./componentFixtureHelper')
const readmeUpdater = require('./readmeUpdater');
const licenseList = require('spdx-license-list/full');

function buildPrePublishOnly({ useVueStyleguidist, useVueDoc, useLint }) {
  const scripts = []
  if (useLint) {
    scripts.push('lint')
  }
  scripts.push('build')
  if (useVueStyleguidist) {
    scripts.push('styleguide:build')
  }
  if (useVueDoc) {
    scripts.push('doc:build')
  }
  return scripts.map(script => `npm run ${script}`).join(' && ')
}

function replaceInLicense(licenseTextTemplate, sourceText, newText) {
  return licenseTextTemplate.replace(new RegExp(`<${sourceText}>`), newText)
    .replace(new RegExp(`\\[${sourceText}\\]`), newText)
}

module.exports = (api, { addBadges, addLicense, componentName, copyrightHolders, licenseName, useComponentFixture, useVueDoc, useVueStyleguidist }) => {

  const useLint = api.hasPlugin('eslint')
  const packageName = api.generator.pkg.name
  const context = { addBadges, addLicense, componentName, licenseName, packageName, useComponentFixture, useLint, useVueDoc, useVueStyleguidist }

  api.extendPackage({
    main: `dist/${packageName}.umd.js`,
    module: `dist/${packageName}.common.min.js`,
    files: [
      "dist/*.css",
      "dist/*.map",
      "dist/*.js",
      `src/*`
    ],
    scripts: {
      serve: "vue-cli-service serve ./example/main.js --open",
      build: `vue-cli-service build --name ${packageName} --entry ./src/index.js --target lib`,
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
        '@vuedoc/md': "^1.5.0"
      }
    })
  }

  if (useComponentFixture) {
    api.extendPackage({
      devDependencies: {
        'component-fixture': "^0.3.0"
      }
    })
  }

  if (addLicense) {
    api.extendPackage({
      license: licenseName
    })
  }

  api.render('./template')

  api.postProcessFiles(files => {
    const hasTest = api.hasPlugin('unit-mocha') || api.hasPlugin('unit-jest');
    if (hasTest) {
      updateFile(files, 'tests/unit/HelloWorld.spec.js', content => content.replace(/HelloWorld/g, componentName));
    }

    updateFile(files, 'README.md', content => readmeUpdater(content, context));

    if (useComponentFixture) {
      updateFile(files, 'src/App.vue', content => updateExample(content, componentName));
    }

    const immutableFiles = ['src/components/HelloWorld.vue', 'src/index.js']
    renameFiles(files, /^src\//, 'example/', (file) => immutableFiles.indexOf(file) !== -1)
    renameFiles(files, /\/HelloWorld\./, `/${componentName}.`)

    if (!addLicense) {
      return;
    }

    const licenseTextTemplate = licenseList[licenseName].licenseText;
    const year = new Date().getFullYear();
    const licenseText = replaceInLicense(licenseTextTemplate, 'year', year);
    files['LICENSE'] = replaceInLicense(licenseText, 'copyright holders', copyrightHolders);
  })
}
