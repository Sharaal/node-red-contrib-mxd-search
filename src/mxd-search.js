const DNode = require('node-red-contrib-dnode');

module.exports = DNode.createNode('mxd-search', (dnode) => {
  const limit = dnode.getConfig('limit');
  const { AssetsQuery, heimdall } = dnode.getServices('heimdall');

  dnode.onInput(async (msg) => {
    const search = msg.payload.searchTitle || msg.payload.title;
    if (!search) {
      throw new Error('missing searchTitle and title in payload');
    }

    const query = (new AssetsQuery())
      .filter('contentTypeSeriesOrMovies')
      .filter('search', search)
      .query('pageSize', limit);
    const assets = await heimdall.getAssets(query);

    dnode.sendMessage({ payload: assets });
  });
});
