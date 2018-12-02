const templateUpdater = (m) => `<component-fixture>

${m}

<Editor slot="control" slot-scope="scope" v-bind="scope"/>

</component-fixture>`;

const componentTemplateRegex = /<HelloWorld (.)*\/>/g;


const script = '<script>';
const scriptUpdater = `<script>
import { ComponentFixture, Editor } from 'component-fixture'`;

const exportComponents = '  components: {';
const exportUpdater = `  components: {
    ComponentFixture,
    Editor,`;

function updateExample(content) {
  const updatedTemplate = content.replace(componentTemplateRegex, templateUpdater);
  const updatedScript = updatedTemplate.replace(script, scriptUpdater);
  const updatedExport = updatedScript.replace(exportComponents, exportUpdater);
  return updatedExport;
}

module.exports = {
  updateExample
};