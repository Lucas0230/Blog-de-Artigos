const Sequelize = require('sequelize');
const connection = new Sequelize('blog', 'root', '123456', {

    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'      // Timezone Brazil
})


module.exports = connection;