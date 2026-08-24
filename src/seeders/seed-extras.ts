/**
 * Additive seeder for the collections the main seeder leaves empty:
 * notifications, programs and announcements.
 *
 * Unlike seed.ts this does NOT call sync({ force: true }) — it only inserts,
 * so it is safe to re-run and never drops a table.
 *
 * Usage (local DB only):
 *   DB_HOST=127.0.0.1 DB_PORT=3307 DB_NAME=olivepath DB_USER=root \
 *   DB_PASSWORD=olivelocal npx ts-node src/seeders/seed-extras.ts
 */

import sequelize from '../db/connection';
import { User, Notification, Program, Announcement } from '../models';

/** The `date` columns are DATEONLY, so they take an ISO yyyy-mm-dd string. */
function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

async function seedExtras(): Promise<void> {
  await sequelize.authenticate();

  const host = String((sequelize.config as any).host ?? '');
  if (host.includes('hstgr') || host.includes('hostinger')) {
    throw new Error('Refusing to run against the production database.');
  }
  console.log(`Connected to ${host}.`);

  // Notifications are per-user, so seed them for every account — otherwise
  // whichever user you sign in as sees an empty list.
  const users = await User.findAll({ order: [['id', 'ASC']] });
  if (users.length === 0) throw new Error('No users found — run the main seeder first.');

  // ── Notifications ──
  await Notification.destroy({ where: {} });
  const notificationTemplates = [
    {
      title: 'New teaching available',
      message: '"The Weight of Grace" is now available to stream and download.',
      type: 'new_teaching',
      isRead: false,
    },
    {
      title: "This week's devotion is ready",
      message: 'Plans for Hope — a reflection on Jeremiah 29:11.',
      type: 'devotion',
      isRead: false,
    },
    {
      title: 'Your prayer request was received',
      message: 'Rev. Ing. Eric Ofori Broni and the team are praying with you.',
      type: 'prayer',
      isRead: false,
    },
    {
      title: 'Sunday service moved to 9:00 AM',
      message: 'Please note the earlier start time for this Sunday only.',
      type: 'general',
      isRead: true,
    },
    {
      title: 'New Q&A answered',
      message: '"How do I hear God’s voice clearly?" has been answered.',
      type: 'new_teaching',
      isRead: true,
    },
    {
      title: 'Book added to the library',
      message: '"Walking in Purpose" is now available in the Library.',
      type: 'general',
      isRead: true,
    },
  ];

  await Notification.bulkCreate(
    users.flatMap((u) =>
      notificationTemplates.map((n) => ({ ...n, userId: u.id })),
    ) as any,
  );
  console.log(`Notifications seeded for ${users.length} user(s).`);

  // ── Programs ──
  await Program.destroy({ where: {} });
  await Program.bulkCreate([
    {
      title: 'Night of Restoration',
      description:
        'An evening of worship, teaching and prayer for everyone believing God for a fresh start.',
      date: daysFromNow(9),
      time: '6:00 PM',
      location: 'Accra International Conference Centre',
      isActive: true,
    },
    {
      title: 'Midweek Bible Study',
      description: 'Working verse by verse through the book of Ephesians.',
      date: daysFromNow(3),
      time: '7:00 PM',
      location: 'Olive Path Sanctuary, East Legon',
      isActive: true,
    },
    {
      title: 'Youth Encounter Weekend',
      description:
        'Two days of teaching and fellowship for young people aged 15 to 25.',
      date: daysFromNow(21),
      time: '10:00 AM',
      location: 'Aburi Retreat Grounds',
      isActive: true,
    },
  ]);
  console.log('Programs seeded.');

  // ── Announcements ──
  await Announcement.destroy({ where: {} });
  await Announcement.bulkCreate([
    {
      title: 'Sunday service time change',
      message: 'This Sunday only, the first service begins at 9:00 AM.',
      date: daysFromNow(2),
      isActive: true,
    },
    {
      title: 'New book released',
      message: '"Walking in Purpose" is now available in the Library.',
      date: daysFromNow(-1),
      isActive: true,
    },
  ]);
  console.log('Announcements seeded.');

  console.log('\nExtras seeded successfully.');
}

seedExtras()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
