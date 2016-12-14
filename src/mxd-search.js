const DNode = require('node-red-contrib-dnode');

module.exports = DNode.createNode('mxd-search', (dnode) => {
  const limit = dnode.getConfig('limit');
  const { AssetsQuery, heimdall } = dnode.getServices('heimdall');

  dnode.onInput(async (msg) => {
    const title = msg.payload.title;
    if (!title) {
      throw new Error('missing title in payload');
    }

    const query = (new AssetsQuery())
      .filter('contentTypeSeriesOrMovies')
      .filter('search', title)
      .query('pageSize', limit);
    const assets = await heimdall.getAssets(query);

    dnode.sendMessage({ payload: assets });
  });
});
