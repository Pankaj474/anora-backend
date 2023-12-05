const User = require('./user/');
const Project = require('./project/');
class Components {
    constructor(app) {
        this.app = app;
        this.initModules();
    }

    initModules() {
        // TODO: Fetch components dynamically without creating objects
        // or use Awilix - ref - https://github.com/jeffijoe/awilix
        /* eslint-disable no-unused-vars */
        const userObj = new User(this.app);
        const projectObj = new Project(this.app);
        /* eslint-enable no-unused-vars */
    }
}

module.exports = Components;
