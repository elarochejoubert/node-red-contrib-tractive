module.exports = function (RED) {
    function TractiveTrackerNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.configNode = RED.nodes.getNode(config.config);
        node.trackerID = config.trackerID;
        node.mode = config.mode || 'hardware';

        node.on('input', async function (msg, send, done) {
            if (!node.configNode || !node.configNode.isAuthenticated()) {
                node.status({ fill: 'red', shape: 'ring', text: 'not authenticated' });
                return done('Tractive config node is not authenticated');
            }

            const trackerID = msg.trackerID || node.trackerID;
            if (!trackerID) return done('No trackerID provided');

            node.status({ fill: 'blue', shape: 'dot', text: 'fetching...' });
            try {
                const client = node.configNode.client;
                const result = node.mode === 'info'
                    ? await client.getTracker(trackerID)
                    : await client.getTrackerHardware(trackerID);
                msg.payload = result;
                node.status({ fill: 'green', shape: 'dot', text: node.mode });
                send(msg);
                done();
            } catch (err) {
                node.status({ fill: 'red', shape: 'ring', text: 'error' });
                done(err);
            }
        });
    }

    RED.nodes.registerType('tractive-tracker', TractiveTrackerNode);
};
