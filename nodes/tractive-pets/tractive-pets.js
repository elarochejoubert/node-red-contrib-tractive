module.exports = function (RED) {
    function TractivePetsNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.configNode = RED.nodes.getNode(config.config);
        node.mode = config.mode || 'all';
        node.petID = config.petID;

        node.on('input', async function (msg, send, done) {
            if (!node.configNode || !node.configNode.isAuthenticated()) {
                node.status({ fill: 'red', shape: 'ring', text: 'not authenticated' });
                return done('Tractive config node is not authenticated');
            }

            node.status({ fill: 'blue', shape: 'dot', text: 'fetching...' });
            try {
                const client = node.configNode.client;
                let result;
                if (node.mode === 'single') {
                    const petID = msg.petID || node.petID;
                    if (!petID) return done('No petID provided');
                    result = await client.getPet(petID);
                } else {
                    result = await client.getPets();
                }
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

    RED.nodes.registerType('tractive-pets', TractivePetsNode);
};
