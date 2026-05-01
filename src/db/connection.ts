import { Sequelize } from 'sequelize';
import fs from 'fs';
import { config } from '../config';

/**
 * SSL config for managed providers like Aiven that require TLS.
 *
 *   DB_SSL=true                              → enable SSL
 *   DB_SSL_CA=<full PEM contents>            → verify against this CA (preferred)
 *   DB_SSL_CA_PATH=/path/to/ca.pem           → load CA from disk
 *   DB_SSL_REJECT_UNAUTHORIZED=false         → skip cert validation
 *                                              (safe for dev / no-CA setups; not
 *                                              recommended for production)
 */
function buildSslConfig(): object | undefined {
  if (process.env.DB_SSL !== 'true') return undefined;

  const inlineCa = process.env.DB_SSL_CA;
  const caPath = process.env.DB_SSL_CA_PATH;
  const rejectUnauthorized =
    process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false';

  let ca: string | undefined = inlineCa;
  if (!ca && caPath) {
    try {
      ca = fs.readFileSync(caPath, 'utf8');
    } catch {
      // fall through — let the connection attempt fail with a clearer error
    }
  }

  return { ssl: { ca, rejectUnauthorized } };
}

const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'mysql',
    logging: config.isDev ? console.log : false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    define: { timestamps: true, underscored: true },
    dialectOptions: buildSslConfig(),
  },
);

export default sequelize;
