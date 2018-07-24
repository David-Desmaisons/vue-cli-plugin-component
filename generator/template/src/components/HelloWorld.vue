---
extend: '@vue/cli-service/generator/template/src/components/HelloWorld.vue'
replace: !!js/regexp /HelloWorld/g
---
<%= options.componentName %>