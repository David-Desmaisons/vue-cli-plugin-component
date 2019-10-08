const { rename, renameFiles, updateFile } = require('./fileHelper')
const { updateExample } = require('./componentFixtureHelper')
const readmeUpdater = require('./readmeUpdater');
const licenseList = require('spdx-license-list/full');
const camelCase = require('camelcase');

function buildPrePublishOnly({ useVueStyleguidist, hasTest, useVueDoc, useLint }) {
  const scripts = []
  if (hasTest) {
    scripts.push('test:unit');
  }
  if (useLint) {
    scripts.push('lint');
  }
  scripts.push('build')
  if (useVueStyleguidist) {
    scripts.push('styleguide:build');
  }
  if (useVueDoc) {
    scripts.push('doc:build');
  }
  return scripts.map(script => `npm run ${script}`).join(' && ')
}

function replaceInLicense(licenseTextTemplate, sourceText, newText) {
  return licenseTextTemplate.replace(new RegExp(`<${sourceText}>`), newText)
    .replace(new RegExp(`\\[${sourceText}\\]`), newText)
}

module.exports = (api, context) => {
  const { addLicense, componentName, copyrightHolders, licenseName, useComponentFixture, useVueDoc, useVueStyleguidist } = context;
  const useLint = api.hasPlugin('eslint');
  const usesTypescript = api.hasPlugin('typescript');
  const extension = usesTypescript ? 'ts' : 'js';
  const hasTest = api.hasPlugin('unit-mocha') || api.hasPlugin('unit-jest');
  context.componentName = camelCase(componentName, { pascalCase: true });
  const packageName = api.generator.pkg.name;
  context.packageName = packageName;
  context.useLint = useLint;
  context.hasTest = hasTest;

  api.extendPackage({
    main: `dist/${packageName}.umd.js`,
    module: `dist/${packageName}.common.min.js`,
    files: [
      "dist/*.css",
      "dist/*.map",
      "dist/*.js",
      'src/*'
    ],
    scripts: {
      serve: `vue-cli-service serve ./example/main.${extension} --open`,
      build: `vue-cli-service build --name ${packageName} --entry ./src/index.${extension} --target lib`,
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
        'doc:build': `npx vuedoc.md --section API --output ./README.md ./src/components/${context.componentName}.vue`
      },
      devDependencies: {
        '@vuedoc/md': "^1.5.0"
      }
    })
  }

  if (useComponentFixture) {
    api.extendPackage({
      devDependencies: {
        'component-fixture': "^1.12.0"
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
    if (hasTest) {
      const updateTestFile = (name) => updateFile(files, `tests/unit/${name}.spec.${extension}`, content => content.replace(/HelloWorld/g, context.componentName));
      updateTestFile('HelloWorld');
      updateTestFile('example');
    }

    updateFile(files, 'README.md', content => readmeUpdater(content, context));

    if (useComponentFixture) {
      updateFile(files, 'src/App.vue', content => updateExample(content, context.componentName));
    }

    const immutableFiles = ['src/components/HelloWorld.vue', 'src/index.js', 'src/index.ts'];
    renameFiles(files, /^src\//, 'example/', (file) => immutableFiles.indexOf(file) !== -1);
    renameFiles(files, /\/HelloWorld\./, `/${context.componentName}.`);

    if (usesTypescript) {
      rename(files, 'src/index.js', 'src/index.ts');
    }

    if (!addLicense) {
      return;
    }

    const licenseTextTemplate = licenseList[licenseName].licenseText;
    const year = new Date().getFullYear();
    const licenseText = replaceInLicense(licenseTextTemplate, 'year', year);
    files['LICENSE'] = replaceInLicense(licenseText, 'copyright holders', copyrightHolders);
  })

  api.onCreateComplete(() => {
    if (useLint) {
      return;
    }
    // Lint generated/modified files
    try {
      const lint = require('@vue/cli-plugin-eslint/lint');
      const files = ['*.js', '.*.js', '*.ts', '*.vue', 'src'];
      lint({ silent: true, _: files }, api);
    } catch (e) {
      api.exitLog('lint not performed', 'warn');
    }
  })
}
