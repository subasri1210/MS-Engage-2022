let mongoose = require('mongoose');

class Database {
    constructor() {
        this.opts = { useNewUrlParser: true };
        this._connect();
    }
    _connect() {
        mongoose.set('debug', true);
        mongoose
            .connect('mongodb://127.0.0.1:27017/ms-enage-facefirst', this.opts)
            .then(() => {
                console.log('Database connection successful');
            })
            .catch((err) => {
                console.error('Database connection error' + err);
            });
    }
}
module.exports = new Database();
