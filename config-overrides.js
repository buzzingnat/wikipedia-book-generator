// Makes react-app-rewired commands work correctly in package.json for create-react-app files

const path = require('path');

module.exports = {
    paths: function (paths, env) {        
        paths.appIndexJs = path.resolve(__dirname, 'src/client/index.tsx');
        paths.appSrc = path.resolve(__dirname, 'src/client');
        return paths;
    },
}
