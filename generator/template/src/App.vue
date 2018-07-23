---
extend: '@vue/cli-service/generator/template/src/App.vue'
replace: !!js/regexp /import HelloWorld from "\.\/components\/HelloWorld\.vue";/
---
import HelloWorld from "@/components/HelloWorld.vue";