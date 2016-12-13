module.exports = (RED) => {
  RED.nodes.registerType('mxd-search', function NODE(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    if (!config.limit) {
      node.error('config is missing');
    }
    node.log('initialize mxd-search node');

    const { AssetsQuery, heimdall } = RED.nodes.getNode(config.heimdall);

    node.on('input', async (msg) => {
      const search = msg.payload;

      if (!search.title) {
        node.warn('no title in the payload');
        return;
      }

      const query = (new AssetsQuery())
        .filter('contentTypeSeriesOrMovies')
        .filter('search', search.title)
        .query('pageSize', config.limit);
      const assets = await heimdall.getAssets(query);

      node.send({ payload: assets });
    });
  }); 
};
