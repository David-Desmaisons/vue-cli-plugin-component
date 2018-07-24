---
extend: '@vue/cli-service/generator/template/src/App.vue'
replace:
  - !!js/regexp /import HelloWorld from '\.\/components\/HelloWorld\.vue'/
  - !!js/regexp /HelloWorld/g
---

<%# REPLACE %>
import <%= options.componentName %> from '@/components/<%= options.componentName %>.vue'
<%# END_REPLACE %>

<%# REPLACE %>
<%= options.componentName %>
<%# END_REPLACE %>
