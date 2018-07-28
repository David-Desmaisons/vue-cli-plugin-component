# vue-cli-component
[![Npm version](https://img.shields.io/npm/v/vue-cli-plugin-component.svg?maxAge=2592000)](https://www.npmjs.com/package/vue-cli-plugin-component)
[![MIT License](https://img.shields.io/github/license/David-Desmaisons/vue-cli-plugin-component.svg)](https://github.com/David-Desmaisons/vue-cli-plugin-component/blob/master/LICENSE)
> component plugin for vue-cli

![demo](./__doc__/vue-ui.png)

```
project
│   README.md  
└───src
│   ├── index.js
│   └───components
│       └───Mycomponent.vue
│   
└───example
    ├── App.vue
    ├── main.js
```

## Features

* Ajust build script to only build the component. Use serve script to serve a demo page.

* Automatically document the component with [vue-styleguidist](https://github.com/vue-styleguidist/vue-styleguidist) and [vuedoc.md](https://gitlab.com/vuedoc/md) .

## Scripts

Use build to build the component
``` sh
nom run build
```

Use serve to serve the application example in the example folder
``` sh
nom run build
```

### When using vue.doc

Use doc:build to pdate the API section of README.md with generated documentation
```
npm run doc:build
```

### When using vueStyleguide

Use styleguide to run style guide dev server
```
npm run styleguide
```

Use styleguide:build to Generate a static HTML style guide
```
npm run styleguide:build
```



## Configuration

![configuration](./__doc__/configuration.png)


**componentName:** the name of the component.

**useVueStyleguidist:** true to install [vue-styleguidist](https://github.com/vue-styleguidist/vue-styleguidist) 

**useVueDoc:** true to install [vuedoc.md](https://gitlab.com/vuedoc/md) 


## Injected Commands

No command will be injected.


## Installing in an Already Created Project

``` sh
vue add component
```

## Injected webpack-chain Rules
No Changes are performed
