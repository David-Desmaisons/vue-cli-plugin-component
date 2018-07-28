const { hasProjectYarn } = require('@vue/cli-shared-utils')

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

module.export = (content, { componentName, useVueDoc, useVueStyleguidist }) => {
    const updateInReadMe = [
        '',
        '# $1',
        '```HTML',
        `<${componentName} :text="hello"></${componentName}>`,
        '```',
        ''
    ];

    if (useVueDoc) {
        updateInReadMe.push('## API','');
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