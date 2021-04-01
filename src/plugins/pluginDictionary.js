import ProjectPlugin from "./ProjectPlugin";
import PluginTemplate from "./PluginTemplate"
import STGplugin from "./STGplugin"

const pluginDictionary = {
    project: ProjectPlugin,
    template: PluginTemplate,
    stg: STGplugin
  };

export default pluginDictionary