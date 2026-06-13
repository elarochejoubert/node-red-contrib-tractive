module.exports = function (RED) {
    function TractiveHistoryNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.configNode = RED.nodes.getNode(config.config);
        node.trackerID = config.trackerID;
        node.hours = parseInt(config.hours) || 24;

        node.on('input', async function (msg, send, done) {
            if (!node.configNode || !node.configNode.isAuthenticated()) {
                node.status({ fill: 'red', shape: 'ring', text: 'not authenticated' });
                return done('Tractive config node is not authenticated');
            }

            const trackerID = msg.trackerID || node.trackerID;
            if (!trackerID) return done('No trackerID provided');

            const to = msg.to ? new Date(msg.to).getTime() : Date.now();
            const from = msg.from ? new Date(msg.from).getTime() : to - node.hours * 60 * 60 * 1000;

            node.status({ fill: 'blue', shape: 'dot', text: 'fetching...' });
            try {
                const history = await node.configNode.client.getTrackerHistory(trackerID, from, to);
                msg.payload = history;
                node.status({ fill: 'green', shape: 'dot', text: `${Array.isArray(history) ? history.length : 0} entries` });
                send(msg);
                done();
            } catch (err) {
                node.status({ fill: 'red', shape: 'ring', text: 'error' });
                done(err);
            }
        });
    }

    RED.nodes.registerType('tractive-history', TractiveHistoryNode);
};
