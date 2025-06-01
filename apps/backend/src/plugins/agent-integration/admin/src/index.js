import pluginPkg from '../../package.json';
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';

const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.addMenuLink({
      to: `/plugins/${name}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${name}.plugin.name`,
        defaultMessage: 'Agent Integration',
      },
      Component: async () => {
        const component = await import('./pages/App');
        return component;
      },
    });
    app.registerPlugin({
      id: name,
      initializer: Initializer,
      isReady: false,
      name,
    });
  },
}; 