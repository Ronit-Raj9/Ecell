import { Event } from '@/types/event';

export const events: Event[] = [
  {
    id: '1',
    title: 'Startup Summit 2024',
    slug: 'startup-summit-2024',
    description: `Join us for the annual Startup Summit where entrepreneurs, investors, and industry experts gather to share insights and build connections. This year's summit will focus on sustainable business models and tech innovations.

The event will feature:
- Keynote speeches from successful founders
- Panel discussions on funding strategies
- Networking sessions with investors
- Pitch competitions with cash prizes
- Workshops on business development

Whether you're a seasoned entrepreneur or just starting your journey, the Startup Summit offers valuable knowledge and connections to help your business thrive.`,
    shortDescription: 'The premier entrepreneurship event featuring keynotes, panels, and networking with industry leaders.',
    date: '2024-08-15T09:00:00.000Z',
    endDate: '2024-08-17T18:00:00.000Z',
    time: '9:00 AM - 6:00 PM',
    venue: 'Main Auditorium, University Campus',
    category: 'Conference',
    banner: '/images/events/startup-summit-banner.jpg',
    thumbnail: '/images/events/startup-summit-thumb.jpg',
    tags: ['Entrepreneurship', 'Innovation', 'Networking', 'Business'],
    speakers: [
      {
        id: 's1',
        name: 'Dr. Rajiv Sharma',
        position: 'CEO',
        organization: 'TechVentures',
        bio: 'Serial entrepreneur with 3 successful exits and advisor to multiple tech startups.',
        imageUrl: '/images/speakers/rajiv-sharma.jpg'
      },
      {
        id: 's2',
        name: 'Priya Mehta',
        position: 'Investment Partner',
        organization: 'Elevation Capital',
        bio: 'Early-stage investor with a portfolio of over 30 startups across fintech and SaaS.',
        imageUrl: '/images/speakers/priya-mehta.jpg'
      }
    ],
    registration: {
      status: 'open',
      deadline: '2024-08-10T23:59:59.000Z',
      maxParticipants: 500,
      currentParticipants: 320,
      fees: {
        amount: 1500,
        currency: 'INR'
      },
      additionalInfo: 'Early bird registration ends July 31st.'
    },
    isPublished: true,
    isFeatured: true,
    registrations: 320,
    createdAt: '2024-05-10T12:00:00.000Z',
    updatedAt: '2024-06-01T15:30:00.000Z'
  },
  {
    id: '2',
    title: 'Hackathon 2024: Build for Tomorrow',
    slug: 'hackathon-2024-build-for-tomorrow',
    description: `Are you ready to code your way to innovation? Join us for a 48-hour hackathon where talented individuals come together to build solutions for real-world problems.

Challenge tracks include:
- Climate Tech: Solutions addressing climate change
- EdTech: Innovations in education technology
- HealthTech: Healthcare solutions using emerging technologies
- Fintech: Reimagining financial services

Participants will have access to mentors, APIs, and resources from our sponsors. Form teams of 2-4 members or join individually and we'll help you find teammates.

Prizes worth ₹5,00,000 to be won across categories!`,
    shortDescription: '48-hour coding competition to build innovative solutions across multiple challenge tracks.',
    date: '2024-07-22T18:00:00.000Z',
    endDate: '2024-07-24T18:00:00.000Z',
    time: '6:00 PM (Day 1) - 6:00 PM (Day 3)',
    venue: 'Innovation Lab, Technology Block',
    category: 'Hackathon',
    banner: '/images/events/hackathon-banner.jpg',
    thumbnail: '/images/events/hackathon-thumb.jpg',
    tags: ['Coding', 'Innovation', 'Technology', 'Competition'],
    registration: {
      status: 'open',
      deadline: '2024-07-15T23:59:59.000Z',
      maxParticipants: 200,
      currentParticipants: 124,
      teamSize: {
        min: 2,
        max: 4
      },
      additionalInfo: 'Participants must bring their own laptops and chargers.'
    },
    isPublished: true,
    isFeatured: true,
    registrations: 124,
    createdAt: '2024-05-15T10:00:00.000Z',
    updatedAt: '2024-06-05T14:20:00.000Z'
  },
  {
    id: '3',
    title: 'Design Thinking Workshop',
    slug: 'design-thinking-workshop',
    description: `Learn how to apply design thinking methodology to solve complex problems and create user-centered solutions. This hands-on workshop will teach you the five stages of design thinking: Empathize, Define, Ideate, Prototype, and Test.

What you'll learn:
- How to identify and empathize with user needs
- Techniques for problem definition and framing
- Creative ideation methods and brainstorming
- Rapid prototyping approaches
- User testing and feedback incorporation

This workshop is perfect for students, entrepreneurs, product managers, and anyone interested in innovative problem-solving approaches.`,
    shortDescription: 'Hands-on workshop teaching design thinking methodology for problem-solving and innovation.',
    date: '2024-06-10T10:00:00.000Z',
    time: '10:00 AM - 4:00 PM',
    venue: 'Design Studio, Fine Arts Department',
    category: 'Workshop',
    banner: '/images/events/design-thinking-banner.jpg',
    thumbnail: '/images/events/design-thinking-thumb.jpg',
    tags: ['Design', 'Innovation', 'Problem Solving', 'UX'],
    registration: {
      status: 'closed',
      maxParticipants: 40,
      currentParticipants: 40,
      fees: {
        amount: 500,
        currency: 'INR'
      }
    },
    winners: [
      {
        id: 'w1',
        name: 'Team Innovate',
        position: 'Best Overall Solution',
        prize: '₹20,000',
        photoUrl: '/images/winners/team-innovate.jpg'
      },
      {
        id: 'w2',
        name: 'UX Masters',
        position: 'Best User Experience',
        prize: '₹10,000',
        photoUrl: '/images/winners/ux-masters.jpg'
      }
    ],
    highlights: [
      {
        id: 'h1',
        title: 'Interactive Sessions',
        description: 'Participants engaged in group exercises to apply design thinking principles.',
        imageUrl: '/images/highlights/interactive-sessions.jpg'
      },
      {
        id: 'h2',
        title: 'Expert Mentorship',
        description: 'Industry professionals provided feedback on prototypes and solutions.',
        imageUrl: '/images/highlights/expert-mentorship.jpg'
      }
    ],
    gallery: [
      {
        id: 'g1',
        url: '/images/gallery/design-workshop-1.jpg',
        caption: 'Participants collaborating on problem definition'
      },
      {
        id: 'g2',
        url: '/images/gallery/design-workshop-2.jpg',
        caption: 'Prototype presentations'
      }
    ],
    isPublished: true,
    isFeatured: false,
    registrations: 40,
    createdAt: '2024-04-20T09:15:00.000Z',
    updatedAt: '2024-06-12T16:40:00.000Z'
  },
  {
    id: '4',
    title: 'Pitch Perfect: Business Idea Competition',
    slug: 'pitch-perfect-business-idea-competition',
    description: `Do you have a groundbreaking business idea? Join Pitch Perfect and showcase your concept to a panel of investors and industry experts. This competition aims to identify and support promising entrepreneurial ideas from students.

Competition format:
- Initial submission of business idea (one-pager)
- Shortlisted teams will be invited for a pitch preparation workshop
- Final pitch day with 5-minute presentations and 3-minute Q&A
- Winners announced and prizes distributed on the same day

Evaluation criteria include innovation, market potential, feasibility, and presentation quality.`,
    shortDescription: 'Business idea competition with mentorship and funding opportunities for student entrepreneurs.',
    date: '2024-09-05T14:00:00.000Z',
    time: '2:00 PM - 7:00 PM',
    venue: 'Business School Auditorium',
    category: 'Competition',
    banner: '/images/events/pitch-perfect-banner.jpg',
    thumbnail: '/images/events/pitch-perfect-thumb.jpg',
    tags: ['Entrepreneurship', 'Business', 'Pitching', 'Startups'],
    registration: {
      status: 'coming_soon',
      deadline: '2024-08-25T23:59:59.000Z',
      maxParticipants: 30,
      teamSize: {
        min: 1,
        max: 3
      },
      fees: {
        amount: 300,
        currency: 'INR'
      }
    },
    isPublished: true,
    isFeatured: false,
    createdAt: '2024-06-01T11:30:00.000Z',
    updatedAt: '2024-06-01T11:30:00.000Z'
  },
  {
    id: '5',
    title: 'Women in Tech Summit',
    slug: 'women-in-tech-summit',
    description: `The Women in Tech Summit aims to celebrate achievements and address challenges faced by women in technology fields. The event features inspiring talks, skill-building workshops, and networking opportunities.

Agenda highlights:
- Keynote by leading women tech founders
- Panel discussion on navigating tech careers
- Mentorship matchmaking session
- Lightning talks by student innovators
- Career fair with tech companies committed to diversity

Men are welcome and encouraged to attend as allies. The summit aims to foster an inclusive environment for everyone passionate about increasing diversity in technology.`,
    shortDescription: 'Conference celebrating and supporting women in technology with talks, workshops, and networking.',
    date: '2024-03-08T09:30:00.000Z',
    time: '9:30 AM - 5:00 PM',
    venue: 'Central Conference Hall',
    category: 'Conference',
    banner: '/images/events/women-in-tech-banner.jpg',
    thumbnail: '/images/events/women-in-tech-thumb.jpg',
    tags: ['Women In Tech', 'Diversity', 'Inclusion', 'Career Development'],
    registration: {
      status: 'closed',
      maxParticipants: 300,
      currentParticipants: 280
    },
    highlights: [
      {
        id: 'h1',
        title: 'Record Attendance',
        description: 'The summit welcomed over 280 participants from various colleges and tech companies.',
        imageUrl: '/images/highlights/record-attendance.jpg'
      },
      {
        id: 'h2',
        title: 'Industry Partnerships',
        description: '15 tech companies participated in the career fair, offering internships and job opportunities.',
        imageUrl: '/images/highlights/industry-partnerships.jpg'
      }
    ],
    gallery: [
      {
        id: 'g1',
        url: '/images/gallery/women-tech-1.jpg',
        caption: 'Keynote session'
      },
      {
        id: 'g2',
        url: '/images/gallery/women-tech-2.jpg',
        caption: 'Panel discussion'
      },
      {
        id: 'g3',
        url: '/images/gallery/women-tech-3.jpg',
        caption: 'Networking session'
      }
    ],
    isPublished: true,
    isFeatured: false,
    registrations: 280,
    createdAt: '2024-01-15T10:45:00.000Z',
    updatedAt: '2024-03-10T18:20:00.000Z'
  }
];

export const getEventById = (id: string): Event | undefined => {
  return events.find(event => event.id === id);
};

export const getEventBySlug = (slug: string): Event | undefined => {
  return events.find(event => event.slug === slug);
}; 