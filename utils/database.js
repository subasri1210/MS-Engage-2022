let mongoose = require('mongoose');

class Database {
    constructor() {
        this.opts = { useNewUrlParser: true };
        this._connect();
    }
    _connect() {
        mongoose.set('debug', true);
        mongoose
            .connect(process.env.MONGO_URI, this.opts)
            .then(() => {
                console.log('Database connection successful');
            })
            .catch((err) => {
                console.error('Database connection error' + err);
            });
    }
}
module.exports = new Database();
