module.exports = [
    {
        type: 'input',
        name: 'componentName',
        message: 'Enter the component name:'
    },
    {
        type: 'confirm',
        name: 'useVueStyleguidist',
        message: 'Use vue-styleguidist to generate documentation?',
        default: true
    },
    {
        type: 'confirm',
        name: 'useVueDoc',
        message: 'Use vuedoc.md to automatically generate README API section?',
        default: true
    },
    {
        type: 'confirm',
        name: 'addBadges',
        message: 'Add project badges to README.md?',
        default: true
    }
]