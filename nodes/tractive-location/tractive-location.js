module.exports = function (RED) {
    function TractiveLocationNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.configNode = RED.nodes.getNode(config.config);
        node.trackerID = config.trackerID;

        node.on('input', async function (msg, send, done) {
            if (!node.configNode || !node.configNode.isAuthenticated()) {
                node.status({ fill: 'red', shape: 'ring', text: 'not authenticated' });
                return done('Tractive config node is not authenticated');
            }

            const trackerID = msg.trackerID || node.trackerID;
            if (!trackerID) return done('No trackerID provided');

            node.status({ fill: 'blue', shape: 'dot', text: 'fetching...' });
            try {
                const location = await node.configNode.client.getTrackerLocation(trackerID);
                msg.payload = location;
                node.status({ fill: 'green', shape: 'dot', text: 'ok' });
                send(msg);
                done();
            } catch (err) {
                node.status({ fill: 'red', shape: 'ring', text: 'error' });
                done(err);
            }
        });
    }

    RED.nodes.registerType('tractive-location', TractiveLocationNode);
};
