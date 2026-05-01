import sequelize from './connection';
import '../models'; // loads associations

async function migrate() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    // sync all models — { alter: true } for dev, { force: true } to drop & recreate
    await sequelize.sync({ alter: true });
    console.log('All tables synced.');

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
