module.exports = (RED) => {
  RED.nodes.registerType('mxd-search', function NODE(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.status({});

    if (!config.limit) {
      node.status({ fill: 'red', shape: 'dot', text: 'config is missing' });
      node.error('config is missing');
      return;
    }
    node.log(`initialize mxd-search node with an limit of ${config.limit}`);

    const { AssetsQuery, heimdall } = RED.nodes.getNode(config.heimdall);
    if (!AssetsQuery || !heimdall) {
      node.status({ fill: 'red', shape: 'dot', text: 'heimdall is missing' });
      node.error('heimdall is missing');
      return;
    }

    node.on('input', async (msg) => {
      node.status({ fill: 'grey', shape: 'dot', text: `requesting...` });
      const search = msg.payload;

      if (!search.title) {
        node.status({ fill: 'yellow', shape: 'dot', text: 'no title in the payload' });
        node.warn('no title in the payload, payload: ');
        node.warn(search);
        return;
      }

      const query = (new AssetsQuery())
        .filter('contentTypeSeriesOrMovies')
        .filter('search', search.title)
        .query('pageSize', config.limit);
      try {
        const assets = await heimdall.getAssets(query);
        node.status({});
        node.send({ payload: assets });
      } catch (e) {
        node.status({ fill: 'yellow', shape: 'dot', text: 'requesting error' });
        node.warn(`requesting error (${e.message})`);
      }
    });
  });
};
