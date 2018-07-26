module.exports = [
    {
        type: 'input',
        name: 'componentName',
        message: 'Enter the component name:',
    },
    {
        type: 'confirm',
        name: 'useVueStyleguidist',
        message: `Use vue-styleguidist?`,
        default: true
    }
]