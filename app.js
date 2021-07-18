const express = require('express');
const mongoose = require('mongoose');
const config = require('config');

const app = express();

app.use('/static', express.static('client/static'));
app.use(express.json());

app.use('', require('./client/routes'));
app.use('/api', require('./api/routes/base.routes'));
app.use('/api', require('./api/routes/auth.routes'));


async function main() {
    const PORT = config.get('port') || 3000;
    const HOSTNAME = config.get('hostname') || 'localhost';

    try {
        await mongoose.connect(config.get('MONGO_URI'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        app.listen(PORT, HOSTNAME, () => {
            console.log(`Server has been started on ${HOSTNAME}:${PORT}`);
        });
    } catch (e) {
        console.log('Server Error', e.message);
    }
}

main();
