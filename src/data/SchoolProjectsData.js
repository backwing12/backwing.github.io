export const schoolProjectsData = {
  web1100: {
    label: 'WEB1100',
    semester: 'Semester 1 (2022)',
    title: 'Kennel Terra Polar',
    description: 'Modernized the website for Terra Polar, an existing dog kennel business, as our first web project. The original site was plain, text-heavy and dated, so we rebuilt it with a cleaner layout and structure while keeping the site fundamentally content-driven.',
    tech: ['HTML', 'CSS'],
    groupSize: 5,
    image: '/projects/web1100.webp',
    links: {
      github: '',
      live: 'https://web1100.sayver.net/',
      archive: 'https://web.archive.org/web/20261008125641/https://web1100.sayver.net/',
    },
  },
  pro1000: {
    label: 'PRO1000',
    semester: 'Semester 2 (2023)',
    title: 'Snatch Media',
    description: 'Built a website for Snatch Media AS, a fictional computer retailer, in collaboration with a local web development company who gave us full creative freedom on design. We met with them regularly to review progress and get feedback. The site was static, but a step up in structure and visual design from our first project.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'jQuery'],
    groupSize: 5,
    image: '/projects/pro1000.webp',
    links: {
      github: '',
      live: 'https://pro1000.sayver.net/',
      archive: 'https://web.archive.org/web/20261008130035/https://pro1000.sayver.net/',
    },
  },
  app2000: {
    label: 'APP2000',
    semester: 'Semester 3-4 (2023-2024)',
    title: 'Sørflaten Auto AS',
    description: 'Built a website from scratch for Sørflaten Auto AS, a real car dealership with no existing web presence. Car listings live in a MySQL database with triggers and stored procedures, and the owner manages everything through an admin panel: adding and editing cars, filling in vehicle details automatically from the Statens vegvesen API by registration number, and a dashboard with sales figures and the most viewed listings. Nightly cron jobs back up the database and images, unpublish cars that have been sold for more than three days, and clean up deleted listings.',
    tech: ['PHP', 'MySQL', 'JavaScript', 'Bootstrap', 'Chart.js', 'Statens vegvesen API', 'Bash/cron'],
    groupSize: 5,
    image: '/projects/app2000.webp',
    links: {
      github: '',
      live: 'https://app2000.sayver.net/',
      archive: 'https://web.archive.org/web/20261008130101/https://app2000.sayver.net/',
    },
  },
}
