const templateUpdater = (m) => `<component-fixture>

      ${m}

      <Editor slot="control" slot-scope="scope" v-bind="scope"/>

    </component-fixture>`;

const script = '<script>';
const scriptUpdater = `<script>
import { ComponentFixture, Editor } from 'component-fixture'`;

const exportComponents = '  components: {';
const exportUpdater = `  components: {
    ComponentFixture,
    Editor,`;

function updateExample(content, componentName) {
  const componentTemplateRegex = new RegExp(`<${componentName} (.)*\/>`, 'g');
  const newValue = templateUpdater(`<${componentName} \/>`);
  const updatedTemplate = content.replace(componentTemplateRegex, newValue);
  const updatedScript = updatedTemplate.replace(script, scriptUpdater);
  return updatedScript.replace(exportComponents, exportUpdater);
}

module.exports = {
  updateExample
};