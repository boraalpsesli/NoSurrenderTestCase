    const ItemSeeder = require('./Seeders/ItemSeeder') ;
    const UserSeeder = require('./Seeders/UserSeeder');
    const seedUserItems = require('./Seeders/seedUserItems');


    async function seed() {
        await ItemSeeder();
        await UserSeeder();
        await seedUserItems();
        process.exit();
    }

    seed();

