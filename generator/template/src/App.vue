---
extend: '@vue/cli-service/generator/template/src/App.vue'
replace:
  - !!js/regexp /import HelloWorld from "./components/HelloWorld.vue";/
---
<%# REPLACE %>
import HelloWorld from "@/components/HelloWorld.vue";
<%# END_REPLACE %>