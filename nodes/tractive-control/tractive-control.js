const ACTIONS = {
    liveOn: client => (id) => client.liveOn(id),
    liveOff: client => (id) => client.liveOff(id),
    LEDOn: client => (id) => client.LEDOn(id),
    LEDOff: client => (id) => client.LEDOff(id),
    buzzerOn: client => (id) => client.buzzerOn(id),
    buzzerOff: client => (id) => client.buzzerOff(id)
};

module.exports = function (RED) {
    function TractiveControlNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.configNode = RED.nodes.getNode(config.config);
        node.trackerID = config.trackerID;
        node.action = config.action || 'liveOn';

        node.on('input', async function (msg, send, done) {
            if (!node.configNode || !node.configNode.isAuthenticated()) {
                node.status({ fill: 'red', shape: 'ring', text: 'not authenticated' });
                return done('Tractive config node is not authenticated');
            }

            const trackerID = msg.trackerID || node.trackerID;
            if (!trackerID) return done('No trackerID provided');

            const action = msg.action || node.action;
            if (!ACTIONS[action]) return done(`Unknown action: ${action}`);

            node.status({ fill: 'blue', shape: 'dot', text: action });
            try {
                const result = await ACTIONS[action](node.configNode.client)(trackerID);
                msg.payload = result;
                node.status({ fill: 'green', shape: 'dot', text: action });
                send(msg);
                done();
            } catch (err) {
                node.status({ fill: 'red', shape: 'ring', text: 'error' });
                done(err);
            }
        });
    }

    RED.nodes.registerType('tractive-control', TractiveControlNode);
};
