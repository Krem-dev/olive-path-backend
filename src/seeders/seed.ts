import sequelize from '../db/connection';
import {
  User,
  Sermon,
  QAItem,
  WeeklyDevotion,
  Notification,
  Book,
  BookChapter,
  BookPurchase,
  BookProgress,
  Announcement,
  Program,
} from '../models';

const PASTOR = 'Rev. Ing. Eric Ofori Broni';
const PASTOR_TITLE = 'EBroni Global Media';

async function seed(): Promise<void> {
  await sequelize.authenticate();
  console.log('Database connected.');

  // force: true drops & recreates all tables. Dev only.
  await sequelize.sync({ force: true });
  console.log('Tables recreated.');

  // ── Users ──
  await User.create({
    name: 'Admin',
    email: 'admin@olivepath.org',
    password: 'admin123',
    authProvider: 'email',
  });

  const grace = await User.create({
    name: 'Grace Mensah',
    email: 'grace@example.com',
    password: 'test1234',
    authProvider: 'email',
  });
  console.log('Users seeded.');

  // ── Weekly devotions (current + 4 past) ──
  await WeeklyDevotion.bulkCreate([
    {
      title: 'Plans for Hope',
      weekStart: '2026-04-27',
      weekEnd: '2026-05-03',
      scripture:
        'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
      scriptureRef: 'Jeremiah 29:11',
      encouragement:
        'God has a purpose for your life. Trust His timing and walk in faith today.',
      reflection:
        'Beloved, there are seasons when the road ahead feels uncertain — when the weight of waiting threatens to drown out the still, small voice of God.\n\nJeremiah spoke these words to a people in exile. They had lost their homes, their temple, their sense of identity. And yet, in the middle of their wandering, God reminded them: I have not forgotten you. I have plans for you.\n\nThis week, take a breath. The plans God has for you are not random. He is writing a story of restoration — and you are not at the end of it.',
      prayer:
        "Father, in the seasons I cannot see clearly, anchor me in Your promises. Quiet my fears and remind me that You are working — even now — for my good. I trust You with my hope and my future. In Jesus' name, Amen.",
      pastorName: PASTOR,
      pastorTitle: PASTOR_TITLE,
    },
    {
      title: 'Walking by Faith',
      weekStart: '2026-04-20',
      weekEnd: '2026-04-26',
      scripture:
        'Now faith is confidence in what we hope for and assurance about what we do not see.',
      scriptureRef: 'Hebrews 11:1',
      encouragement: 'Faith is the bridge between the promise and its fulfillment.',
      reflection:
        'Faith is not the absence of fear — it is the choice to trust God in the middle of it. This week, we explored what it looks like to take steps toward the unseen, anchored in the character of the One who has already gone before us.',
      pastorName: PASTOR,
      pastorTitle: PASTOR_TITLE,
    },
    {
      title: "God's Sovereignty",
      weekStart: '2026-04-13',
      weekEnd: '2026-04-19',
      scripture:
        'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
      scriptureRef: 'Romans 8:28',
      encouragement: 'Even what feels broken is being woven into something beautiful.',
      reflection:
        "Nothing in your life is wasted in God's economy. The detours, the delays, the disappointments — He is sovereign over them all.",
      pastorName: PASTOR,
      pastorTitle: PASTOR_TITLE,
    },
    {
      title: 'Strength in Trials',
      weekStart: '2026-04-06',
      weekEnd: '2026-04-12',
      scripture:
        'Consider it pure joy, my brothers and sisters, whenever you face trials of many kinds, because you know that the testing of your faith produces perseverance.',
      scriptureRef: 'James 1:2-4',
      encouragement: 'Pressure is not punishment — it is preparation.',
      reflection:
        'God is not surprised by your storm. He is in it with you, refining what cannot be refined any other way.',
      pastorName: PASTOR,
      pastorTitle: PASTOR_TITLE,
    },
    {
      title: 'The Heart of Worship',
      weekStart: '2026-03-30',
      weekEnd: '2026-04-05',
      scripture:
        'Yet a time is coming and has now come when the true worshipers will worship the Father in the Spirit and in truth.',
      scriptureRef: 'John 4:23',
      encouragement: 'Worship is not an event. It is a posture.',
      reflection:
        'Authentic worship begins long before the music starts. It is the daily yes that says, "Lord, You are worthy."',
      pastorName: PASTOR,
      pastorTitle: PASTOR_TITLE,
    },
  ]);
  console.log('Weekly devotions seeded.');

  // ── Sermons ──
  await Sermon.bulkCreate([
    {
      title: 'The Power of Faith',
      scripture: 'Hebrews 11:1',
      summary:
        'An exploration of what it means to walk by faith and not by sight in our daily lives.',
      thumbnailUrl: 'https://picsum.photos/seed/sermon1/400/225',
      videoId: 'dQw4w9WgXcQ',
      duration: '45 min',
      contentType: 'video',
      category: 'preaching',
      publishedAt: new Date('2026-03-20'),
      viewCount: 1250,
    },
    {
      title: 'Grace That Transforms',
      scripture: 'Ephesians 2:8-9',
      summary:
        "Understanding the depth of God's grace and how it transforms every area of our lives.",
      thumbnailUrl: 'https://picsum.photos/seed/sermon2/400/225',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      duration: '38 min',
      contentType: 'audio',
      category: 'preaching',
      publishedAt: new Date('2026-03-17'),
      viewCount: 980,
    },
    {
      title: 'Walking in the Spirit',
      scripture: 'Galatians 5:16',
      summary:
        'Practical steps to living a Spirit-led life and bearing the fruit of the Spirit.',
      thumbnailUrl: 'https://picsum.photos/seed/sermon3/400/225',
      videoId: 'dQw4w9WgXcQ',
      duration: '52 min',
      contentType: 'video',
      category: 'preaching',
      publishedAt: new Date('2026-03-13'),
      viewCount: 2100,
    },
    {
      title: 'The Heart of Worship',
      scripture: 'John 4:24',
      summary:
        'What does it mean to worship God in spirit and in truth? A deep look at authentic worship.',
      thumbnailUrl: 'https://picsum.photos/seed/sermon4/400/225',
      duration: '41 min',
      contentType: 'reading',
      category: 'preaching',
      publishedAt: new Date('2026-03-10'),
      viewCount: 750,
    },
    {
      title: 'Rise Above Your Circumstances',
      scripture: 'Romans 8:28',
      summary:
        'Every setback is a setup for a greater comeback. God is working all things together for your good.',
      thumbnailUrl: 'https://picsum.photos/seed/motiv1/400/225',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      duration: '18 min',
      contentType: 'audio',
      category: 'motivation',
      publishedAt: new Date('2026-03-21'),
      viewCount: 890,
    },
    {
      title: 'You Are Not Alone',
      scripture: 'Isaiah 41:10',
      summary:
        'In your darkest moments, remember that God is right there with you. He will never leave you.',
      thumbnailUrl: 'https://picsum.photos/seed/motiv2/400/225',
      duration: '15 min',
      contentType: 'reading',
      category: 'motivation',
      publishedAt: new Date('2026-03-18'),
      viewCount: 1100,
    },
  ]);
  console.log('Sermons seeded.');

  // ── Q&A ──
  await QAItem.bulkCreate([
    {
      question: 'What does the Bible say about tithing?',
      answer:
        'Tithing is the practice of giving a tenth of your income to God. It is an act of worship and obedience that demonstrates trust in God as our provider.',
      scripture: 'Malachi 3:10',
      category: 'Finance',
      sortOrder: 1,
    },
    {
      question: "How do I know God's will for my life?",
      answer:
        'God reveals His will through His Word, prayer, the Holy Spirit, godly counsel, and circumstances. Seek Him earnestly and He will direct your path.',
      scripture: 'Proverbs 3:5-6',
      category: 'Guidance',
      sortOrder: 1,
    },
    {
      question: 'Is speaking in tongues for today?',
      answer:
        'Speaking in tongues is a gift of the Holy Spirit that is available to believers today.',
      scripture: '1 Corinthians 14:2',
      category: 'Holy Spirit',
      sortOrder: 1,
    },
    {
      question: 'What is the baptism of the Holy Spirit?',
      answer:
        'The baptism of the Holy Spirit is a distinct experience from salvation where believers receive supernatural power for service and witness.',
      scripture: 'Acts 1:8',
      category: 'Holy Spirit',
      sortOrder: 2,
    },
    {
      question: 'How should Christians handle anxiety?',
      answer:
        'The Bible instructs us to cast our anxieties on God through prayer and thanksgiving, trusting that His peace will guard our hearts and minds.',
      scripture: 'Philippians 4:6-7',
      category: 'Christian Living',
      sortOrder: 1,
    },
    {
      question: 'What does the Bible say about forgiveness?',
      answer:
        'Forgiveness is central to the Christian faith. As God has forgiven us through Christ, we are called to forgive others.',
      scripture: 'Colossians 3:13',
      category: 'Christian Living',
      sortOrder: 2,
    },
  ]);
  console.log('Q&A items seeded.');

  // ── Books ──
  const planForHope = await Book.create({
    title: 'Plans for Hope',
    subtitle: 'A 30-day devotional for seasons of waiting',
    author: PASTOR,
    authorTitle: PASTOR_TITLE,
    description:
      "When the road ahead feels uncertain, scripture reminds us that God's plans are rooted in hope. This 30-day devotional walks through Jeremiah's promise, daily reflections, and prayers.",
    coverUrl: 'https://picsum.photos/seed/book-plans-for-hope/600/900',
    pages: 142,
    price: 40,
    currency: 'GHS',
    categories: 'Devotional,Hope',
    publishedAt: new Date('2025-09-15'),
  });

  const heartOfWorship = await Book.create({
    title: 'The Heart of Worship',
    subtitle: 'Restoring authentic worship in everyday life',
    author: PASTOR,
    authorTitle: PASTOR_TITLE,
    description:
      'Worship begins long before the music starts. A practical and theological look at what it means to worship the Father in spirit and in truth.',
    coverUrl: 'https://picsum.photos/seed/book-heart-of-worship/600/900',
    pages: 168,
    price: 45,
    currency: 'GHS',
    categories: 'Worship,Christian Living',
    publishedAt: new Date('2024-11-20'),
  });

  const anchored = await Book.create({
    title: 'Anchored',
    subtitle: 'Finding steady ground in unsteady times',
    author: PASTOR,
    authorTitle: PASTOR_TITLE,
    description:
      "A short, free devotional sampler — five reflections to anchor your heart in God's unchanging character.",
    coverUrl: 'https://picsum.photos/seed/book-anchored/600/900',
    pages: 48,
    price: 0,
    currency: 'GHS',
    categories: 'Devotional,Free',
    publishedAt: new Date('2025-12-01'),
  });

  await Book.bulkCreate([
    {
      title: 'Walking by Faith',
      subtitle: 'Trusting God when you cannot see the path',
      author: PASTOR,
      authorTitle: PASTOR_TITLE,
      description:
        'Faith is not the absence of fear — it is the choice to trust the One who has gone before us.',
      coverUrl: 'https://picsum.photos/seed/book-walking-by-faith/600/900',
      pages: 198,
      price: 55,
      currency: 'GHS',
      categories: 'Faith,Christian Living',
      publishedAt: new Date('2025-06-04'),
    },
    {
      title: 'Kingdom Leadership',
      subtitle: 'Biblical principles for influence and impact',
      author: PASTOR,
      authorTitle: PASTOR_TITLE,
      description:
        'A guide for leaders in church, business, and family — drawn from the lives of biblical leaders.',
      coverUrl: 'https://picsum.photos/seed/book-kingdom-leadership/600/900',
      pages: 224,
      price: 60,
      currency: 'GHS',
      categories: 'Leadership,Ministry',
      publishedAt: new Date('2024-03-12'),
    },
    {
      title: 'Marriage in the Lord',
      subtitle: 'Building a Christ-centered home',
      author: PASTOR,
      authorTitle: PASTOR_TITLE,
      description:
        'A pastoral teaching on biblical marriage — for engaged couples, newlyweds, and seasoned spouses.',
      coverUrl: 'https://picsum.photos/seed/book-marriage-in-the-lord/600/900',
      pages: 184,
      price: 50,
      currency: 'GHS',
      categories: 'Marriage,Family',
      publishedAt: new Date('2024-08-30'),
    },
  ]);
  console.log('Books seeded.');

  // ── Book chapters ──
  await BookChapter.bulkCreate([
    {
      bookId: planForHope.id,
      number: 1,
      title: 'The Promise',
      body: [
        'There is a verse most believers know by heart, but few of us have stopped to consider the soil it grew in. Jeremiah 29:11 was not whispered to a comfortable people.',
        'And in the middle of that grief, the prophet sent them a letter. Not a letter of escape, but of presence.',
        'Then came the words that have steadied so many hearts since: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future."',
      ].join('\n\n'),
    },
    {
      bookId: planForHope.id,
      number: 2,
      title: 'Seasons of Waiting',
      body: [
        'Waiting is one of the hardest things God asks of us. Harder, sometimes, than walking through pain itself.',
        'But waiting in scripture is rarely empty. Abraham waited twenty-five years for Isaac. Joseph waited thirteen years between the dream and the throne.',
        'When God seems silent, He is rarely absent.',
      ].join('\n\n'),
    },
    {
      bookId: planForHope.id,
      number: 3,
      title: 'A Future and a Hope',
      body: [
        'Hope is not optimism. Optimism is a hunch that things will work out. Hope is a confidence that the One who holds the future is good, faithful, and for you.',
        'The author of Hebrews calls hope an anchor for the soul, firm and secure.',
        'Walk forward. Even slowly. He is with you.',
      ].join('\n\n'),
    },
  ]);

  await BookChapter.bulkCreate([
    {
      bookId: heartOfWorship.id,
      number: 1,
      title: 'In Spirit and in Truth',
      body: [
        'Worship begins long before the music starts. By the time we sing, we have already worshipped — or refused to — in a hundred small choices that morning.',
        'Jesus told the woman at the well that the Father is seeking worshippers who will worship in spirit and in truth.',
      ].join('\n\n'),
    },
    {
      bookId: heartOfWorship.id,
      number: 2,
      title: 'The Posture of the Heart',
      body: [
        'David danced before the ark with all his might. His wife despised him for it. He answered: "I will become even more undignified than this."',
        'But worship is not always loud. Sometimes it is the quiet "yes" you say at 5 a.m. when no one is watching.',
        'God is not impressed by volume. He is moved by surrender.',
      ].join('\n\n'),
    },
  ]);

  await BookChapter.create({
    bookId: anchored.id,
    number: 1,
    title: 'Anchored',
    body: [
      'There are seasons when the wind howls and every familiar landmark disappears. In those seasons, the only thing that keeps a ship from being broken on the rocks is the anchor.',
      'Our hope in Christ is that anchor.',
      'This short devotional is an invitation to remember the ground beneath your feet — the unchanging character of God.',
    ].join('\n\n'),
  });
  console.log('Book chapters seeded.');

  // ── Sample purchases + progress for Grace ──
  await BookPurchase.bulkCreate([
    {
      userId: grace.id,
      bookId: planForHope.id,
      amount: 40,
      currency: 'GHS',
      paystackRef: 'seed_paid_001',
      status: 'paid',
      paidAt: new Date('2026-04-15'),
    },
    {
      userId: grace.id,
      bookId: heartOfWorship.id,
      amount: 45,
      currency: 'GHS',
      paystackRef: 'seed_paid_002',
      status: 'paid',
      paidAt: new Date('2026-03-22'),
    },
    {
      userId: grace.id,
      bookId: anchored.id,
      amount: 0,
      currency: 'GHS',
      status: 'free',
      paidAt: new Date('2026-03-30'),
    },
  ]);

  await BookProgress.bulkCreate([
    {
      userId: grace.id,
      bookId: planForHope.id,
      currentPage: 60,
      progress: 60 / 142,
      lastOpenedAt: new Date('2026-04-30'),
    },
    {
      userId: grace.id,
      bookId: heartOfWorship.id,
      currentPage: 131,
      progress: 131 / 168,
      lastOpenedAt: new Date('2026-04-25'),
    },
    {
      userId: grace.id,
      bookId: anchored.id,
      currentPage: 48,
      progress: 1,
      lastOpenedAt: new Date('2026-04-10'),
    },
  ]);
  console.log('Purchases & progress seeded.');

  // ── Announcements ──
  await Announcement.bulkCreate([
    {
      title: 'Sunday Worship Service',
      message:
        'Join us this Sunday for a powerful time of worship and the Word. Service starts at 8:00 AM.',
      date: '2026-05-04',
    },
    {
      title: 'Youth Conference 2026',
      message:
        'Registration is now open for the Olive Path Youth Conference. Theme: "Arise and Shine."',
      date: '2026-05-20',
    },
  ]);

  // ── Programs ──
  await Program.bulkCreate([
    {
      title: 'Kingdom Leadership Summit',
      description:
        'A gathering of leaders across churches to discuss kingdom principles for leadership and influence.',
      date: '2026-05-10',
      time: '9:00 AM',
      location: 'ICCC Worship Temple, Atonkore',
    },
    {
      title: 'Marriage & Family Seminar',
      description:
        'Practical biblical teaching on building strong marriages and raising godly families.',
      date: '2026-05-24',
      time: '10:00 AM',
      location: 'Olive Path Center, Kumasi',
    },
  ]);

  // ── Notifications ──
  await Notification.bulkCreate([
    {
      userId: grace.id,
      title: 'New Teaching Available',
      message: '"The Power of Faith" has been added to Preaching.',
      type: 'new_teaching',
    },
    {
      userId: grace.id,
      title: "This Week's Devotion",
      message: 'Your weekly devotion is ready. Start with "Plans for Hope".',
      type: 'devotion',
    },
    {
      userId: grace.id,
      title: 'Welcome',
      message:
        'Welcome to Olive Path. Explore teachings, devotions, and books.',
      type: 'general',
      isRead: true,
    },
  ]);

  console.log('\nSeed completed successfully.');
  console.log('Test user:  grace@example.com / test1234');
  console.log('Admin user: admin@olivepath.org / admin123');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
