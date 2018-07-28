const { hasProjectYarn } = require('@vue/cli-shared-utils')

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

function updateReadMe(content, { componentName, useVueDoc, useVueStyleguidist }) {
  var updateInReadMe = `# $1

\`\`\`HTML
  <${componentName} :text="hello"></${componentName}>
\`\`\`

`
  if (useVueDoc) {
    updateInReadMe += `## API

`
  }
  updateInReadMe += `## Installation
\`\`\`
  npm install $1
\`\`\``
  let updatedContext = content.replace(/^# (.+)$/m, updateInReadMe)
  updatedContext += updateScriptDescription({ useVueDoc, useVueStyleguidist })
  return updatedContext
}

const descriptions = {
  useVueStyleguidist: {
    styleguide: "Run style guide dev server",
    'styleguide:build': "Generate a static HTML style guide"
  },
  useVueDoc: {
    'doc:build': "Update the API section of README.md with generated documentation"
  }
}

function updateScriptDescription(options) {
  const hasYarn = hasProjectYarn(process.cwd())
  const packageManager = hasYarn ? 'yarn' : 'npm'
  let scriptDescription = ''

  for (var option in options) {
    if (!options[option]) {
      continue;
    }
    let scripts = descriptions[option]
    scriptDescription += Object.keys(scripts).map(key => {
      return [
        `\n### ${scripts[key]}`,
        '```',
        `${packageManager} run ${key}`,
        '```',
        ''
      ].join('\n')
    }).join('')
  }
  return scriptDescription
}

module.exports = (api, { componentName, useVueStyleguidist, useVueDoc }) => {

  const useLint = api.hasPlugin('eslint')
  const context = { componentName, useVueStyleguidist, useVueDoc, useLint }

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
    const { renameFiles, updateFile } = require('./fileHelper')
    if (hasTest) {
      updateFile(files, 'tests/unit/HelloWorld.spec.js', content => content.replace(/HelloWorld/g, componentName))
    }

    updateFile(files, 'README.md', content => updateReadMe(content, context))

    const immutableFiles = ['src/components/HelloWorld.vue', 'src/index.js']
    renameFiles(files, /^src\//, 'example/', (file) => immutableFiles.indexOf(file) !== -1)
    renameFiles(files, /\/HelloWorld\./, `/${componentName}.`)
  })
}
