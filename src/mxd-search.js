module.exports = (RED) => {
  RED.nodes.registerType('mxd-search', function NODE(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.status({});

    if (!config.limit) {
      node.status({ fill: 'red', shape: 'dot', text: 'config is missing' });
      node.error('config is missing');
    }
    node.log(`initialize mxd-search node with an limit of ${config.limit}`);

    const { AssetsQuery, heimdall } = RED.nodes.getNode(config.heimdall);

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
      let assets;
      try {
        assets = await heimdall.getAssets(query);
      } catch (e) {
        node.status({ fill: 'yellow', shape: 'dot', text: 'requesting error' });
        node.warn(`requesting error (${e.message})`);
        return;
      }

      node.status({});
      node.send({ payload: assets });
    });
  });
};
