import { Category, ArticleStatus } from '@prisma/client';

export interface MockArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: Category;
  imageUrl: string;
  videoUrl?: string | null;
  sourceUrl: string;
  status: ArticleStatus;
  isTrending: boolean;
  isFeatured: boolean;
  views: number;
  likesCount: number;
  uploaderName: string;
  createdAt: string;
}

export const MOCK_ARTICLES: MockArticle[] = [
  {
    id: 'm1',
    title: 'The Future of Quantum Computing: Entering a New Era of Processing Power',
    slug: 'future-of-quantum-computing-2026',
    summary: 'Researchers make breakthroughs in room-temperature qubits, promising to accelerate AI modeling and cryptographic processing standard bounds.',
    content: `Quantum computing has long been a holy grail for scientists, promethean in its promise but notoriously difficult to realize due to thermal constraints. However, a joint collaboration of international researchers has announced a breakthrough: stable qubits running at warm conditions.

This represents a paradigm shift. Standard supercomputers would take thousands of years to calculate what quantum computers can crack in seconds. From revolutionary cryptographic keys to hyper-accelerated AI models, the implications are vast.

### Key Breakthroughs:
1. **Qubit Stability**: Reduced decoherence rates by 95% at near-ambient temperatures.
2. **Error Correction**: Integrated logical qubit mapping directly in physical silicon arrays.
3. **Scalability**: Seamless interfacing with modern optical fiber buses.

As industries prepare for this quantum leap, cybersecurity frameworks are scrambling to adopt quantum-resistant algorithms before existing standards become obsolete.`,
    category: Category.TECH,
    imageUrl: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=1200',
    sourceUrl: 'https://www.nature.com/articles/quantum-computing-breakthrough',
    status: ArticleStatus.APPROVED,
    isTrending: true,
    isFeatured: true,
    views: 1240,
    likesCount: 145,
    uploaderName: 'Dr. Alexis Vance',
    createdAt: '2026-05-19T14:30:00.000Z'
  },
  {
    id: 'm2',
    title: 'Clash of Champions: Thrilling Finish in the UEFA Champions League Finals',
    slug: 'champions-league-finals-thrilling-finish',
    summary: 'A dramatic 93rd-minute bicycle kick turns the stadium into pandemonium, securing the historic treble for the underdogs.',
    content: `It was a match written in the stars. Underdogs entering the finals against a multi-billion dollar squad. With 90 minutes of nail-biting tactical battle, the score stood locked at 2-2. 

As three minutes of added stoppage time ticked down, a deflected corner ball floated high over the penalty area. What followed will be etched in sports history forever. A spectacular, gravity-defying bicycle kick caught the top corner of the net. 

The stadium erupted into sheer pandemonium. The treble was secured. The underdogs had conquered Europe.

### Highlights:
- **Possession**: 42% vs 58% in favor of the giants.
- **Pass Accuracy**: 89% under high-pressing defensive alignments.
- **Player of the Match**: Marcus Vance (1 goal, 1 assist).`,
    category: Category.SPORTS,
    imageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&q=80&w=1200',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // Premium direct mp4 sample video
    sourceUrl: 'https://www.uefa.com/uefachampionsleague/',
    status: ArticleStatus.APPROVED,
    isTrending: true,
    isFeatured: false,
    views: 940,
    likesCount: 88,
    uploaderName: 'Sarah Jenkins',
    createdAt: '2026-05-20T08:15:00.000Z'
  },
  {
    id: 'm3',
    title: 'Grammy Awards 2026: Independent Artists Dominate Top Category Sweeps',
    slug: 'grammy-awards-2026-indie-artists-sweep',
    summary: 'Streaming platforms and community-driven music spaces fuel a historic night where record labels lose their decade-long grip on major trophies.',
    content: `The music landscape has officially shifted. Tonight, the Grammys proved that creativity and grassroots connection matter more than industrial budgets. 

Indie synth-pop project 'Nova Drift' secured Album of the Year, while DIY singer-songwriter Maya Lin won Record of the Year. It was a massive win for decentralized distribution platforms and independent studios who have utilized micro-communities to build colossal audiences.

"This is for the bedroom producers working with $100 microphones," Maya Lin stated in her emotional acceptance speech.`,
    category: Category.MUSIC,
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200',
    sourceUrl: 'https://www.grammy.com/news',
    status: ArticleStatus.APPROVED,
    isTrending: false,
    isFeatured: false,
    views: 450,
    likesCount: 52,
    uploaderName: 'David Lee',
    createdAt: '2026-05-18T10:00:00.000Z'
  },
  {
    id: 'm4',
    title: 'Behind the Scenes of the New Sci-Fi Blockbuster Shaking the Box Office',
    slug: 'scifi-blockbuster-box-office-scenes',
    summary: 'We sit down with directors and VFX coordinators to explore the cutting-edge real-time neural renders that replaced standard green screens.',
    content: `The upcoming space odyssey 'Aether' is not just a film; it is a technological marvel. Generating over $150 million on its opening weekend, it has rewritten theatrical achievements.

We went behind the scenes with VFX Supervisor Ryan Chen to understand how they achieved absolute photorealism. Instead of traditional green screens, they employed custom real-time neural rendering platforms. These virtual sets project dynamic HSL lighting directly onto actors in real-time, resulting in flawless cinematic immersion.

"The camera tracks light naturally, giving us perfect reflections on helmets and metallic suits," Ryan stated.`,
    category: Category.ENTERTAINMENT,
    imageUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=1200',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4', // Another standard direct mp4 sample video
    sourceUrl: 'https://www.imdb.com/news',
    status: ArticleStatus.APPROVED,
    isTrending: true,
    isFeatured: false,
    views: 820,
    likesCount: 65,
    uploaderName: 'Elena Rostova',
    createdAt: '2026-05-20T05:00:00.000Z'
  },
  {
    id: 'm5',
    title: 'Global Markets Shift: The Rise of Sustainable Investment Portfolios',
    slug: 'sustainable-investments-global-market-shifts',
    summary: 'A deep analysis into how ESG matrices have become the primary determinant for institutional investors managing trillions.',
    content: `Environmental, Social, and Governance (ESG) criteria are no longer optional compliance ticks. In 2026, they are the primary engines behind major capital migrations.

According to a report from Vanguard Group, institutional funds have redirected over $4.2 trillion into high-rating ESG portfolios. Companies with carbon-neutral targets and transparent corporate structures are outperforming traditional peers by 12.4% annually.

### Market Drivers:
1. **Consumer Advocacy**: Gen Z and Millennial buyers boycotting non-sustainable brands.
2. **Regulatory Audits**: Stricter carbon emission audits in EU and North American sectors.
3. **Resource Efficiency**: Circular supply chains lowering operating costs.`,
    category: Category.BUSINESS,
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1200',
    sourceUrl: 'https://www.bloomberg.com/markets',
    status: ArticleStatus.APPROVED,
    isTrending: false,
    isFeatured: false,
    views: 610,
    likesCount: 42,
    uploaderName: 'David Lee',
    createdAt: '2026-05-19T09:00:00.000Z'
  },
  {
    id: 'm6',
    title: 'Political Summit 2026: Historic Climate Accord Signed by G20 Nations',
    slug: 'g20-summit-climate-accord-signed',
    summary: 'Borders dissolve in carbon cooperation as major economies pledge direct resource transfers to transition developing grids.',
    content: `In what observers are calling the most significant international agreement since the Paris Accord, G20 world leaders have ratified a binding carbon cooperation treaty.

The new treaty establishes a global "Carbon Transfer Fund" where developed economies will directly subsidize clean energy grids in developing regions. 

Critics highlight enforcement concerns, but proponents point to the economic incentives built into zero-emission manufacturing exemptions as the key driver for success.`,
    category: Category.POLITICS,
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=1200',
    sourceUrl: 'https://www.reuters.com/world/',
    status: ArticleStatus.APPROVED,
    isTrending: false,
    isFeatured: false,
    views: 520,
    likesCount: 39,
    uploaderName: 'Sarah Jenkins',
    createdAt: '2026-05-20T01:30:00.000Z'
  }
];
