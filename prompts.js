
const camelCase = require('camelcase');
const licensesInformation = require('spdx-license-list/spdx-simple.json')
const licenses = licensesInformation.map(name => ({
  name,
  value: name
}));

const prompts = module.exports = [
  {
    type: 'input',
    name: 'componentName',
    message: 'Enter the component name (in PascalCase- no hyphen nor dash):'
  },
  {
    type: 'confirm',
    name: 'useComponentFixture',
    message: 'Use componentFixture to build example?',
    default: true,
    group: 'Example',
  },
  {
    type: 'confirm',
    name: 'useVueStyleguidist',
    message: 'Use vue-styleguidist to generate documentation?',
    default: false,
    group: 'Documentation',
  },
  {
    type: 'confirm',
    name: 'useVueDoc',
    message: 'Use vuedoc.md to automatically generate README API section?',
    default: true,
    group: 'Documentation'
  },
  {
    type: 'confirm',
    name: 'addBadges',
    message: 'Add project badges to README.md?',
    default: true,
    group: 'Documentation'
  },
  {
    type: 'confirm',
    name: 'addLicense',
    message: 'Add license?',
    group: 'License',
    default: false
  },
  {
    type: 'list',
    name: 'licenseName',
    when: answer => answer.addLicense,
    message: 'Choose a license:',
    group: 'License',
    choices: licenses,
    default: 'MIT'
  },
  {
    type: 'input',
    name: 'copyrightHolders',
    when: answer => answer.addLicense,
    message: 'Enter copyright holders:',
    group: 'License',
  },
]

module.exports.getPrompts = pkg => {
  prompts[0].default = camelCase(pkg.name, {pascalCase: true});
  return prompts
}