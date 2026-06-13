const tractive = require('tractive');

module.exports = function (RED) {
    function TractiveConfigNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.authenticated = false;

        const email = node.credentials.email;
        const password = node.credentials.password;

        if (email && password) {
            tractive.connect(email, password).then(ok => {
                node.authenticated = ok;
                if (!ok) node.error('Tractive authentication failed — check credentials');
            }).catch(err => {
                node.error('Tractive connect error: ' + err.message);
            });
        }

        node.isAuthenticated = function () {
            return node.authenticated;
        };

        node.client = tractive;
    }

    RED.nodes.registerType('tractive-config', TractiveConfigNode, {
        credentials: {
            email: { type: 'text' },
            password: { type: 'password' }
        }
    });
};
