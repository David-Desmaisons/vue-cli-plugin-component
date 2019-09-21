const templateUpdater = (m) => `<sandbox>

      ${m}

    </sandbox>`;

const script = '<script>';
const scriptUpdater = `<script>
import { Sandbox } from 'component-fixture'
import "font-awesome/css/font-awesome.css";
import "component-fixture/dist/ComponentFixture.css";`;

const exportComponents = '  components: {';
const exportUpdater = `  components: {
    Sandbox,`;

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