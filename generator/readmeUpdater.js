const { hasProjectYarn, hasProjectGit  } = require('@vue/cli-shared-utils')

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

module.exports = (content, { addBadges, addLicense, componentName, licenseName, useVueDoc, useVueStyleguidist }) => {
    const hasGit = hasProjectGit (process.cwd())

    const updateInReadMe = [
        '',
        '# $1'
    ]

    if (addBadges) {
        if (hasGit){
            var userName = require('git-user-name')();
            updateInReadMe.push(
                `[![GitHub open issues](https://img.shields.io/github/issues/${userName}/$1.svg?maxAge=2592000)](https://github.com/${userName}/$1/issues)`
            )    
        }
        updateInReadMe.push(
            '[![Npm version](https://img.shields.io/npm/v/$1.svg?maxAge=2592000)](https://www.npmjs.com/package/$1)',
        );
        if (hasGit && addLicense){
            updateInReadMe.push(
                `[![${licenseName} License](https://img.shields.io/github/license/${userName}/$1.svg)](https://github.com/${userName}/$1/blob/master/LICENSE)`,
            );
        }
    }

    updateInReadMe.push(
        '',
        '## Usage',
        '```HTML',
        `<${componentName} :text="hello"></${componentName}>`,
        '```',
        '```javascript',
        `import { ${componentName} } from '$1'`,
        '',
        'export default {',
        '  components: {',
        `    ${componentName}`,
        '  }',
        '}',
        '```'
    );

    if (useVueDoc) {
        updateInReadMe.push(
            '## API',
            ''
        );
    }

    updateInReadMe.push(
        '## Installation',
        '```',
        'npm install $1',
        '```',
    )
    const updateInReadMeText = updateInReadMe.join('\n')
    let updatedContext = content.replace(/^# (.+)$/m, updateInReadMeText)
    updatedContext += updateScriptDescription({ useVueDoc, useVueStyleguidist })
    return updatedContext
}