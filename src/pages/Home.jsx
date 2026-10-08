import { Link } from 'react-router-dom'
import { IconMovie, IconBomb, IconSchool } from '@tabler/icons-react'
import { schoolProjectsData } from '../data/SchoolProjectsData'

const personalProjects = [
  {
    label: 'Movies',
    path: '/movies',
    icon: <IconMovie size={20} stroke={1.5} />,
    desc: 'Track, rate and discover films',
  },
  {
    label: 'Minesweeper',
    path: '/minesweeper',
    icon: <IconBomb size={20} stroke={1.5} />,
    desc: 'The classic grid game',
  },
]

const schoolProjects = Object.entries(schoolProjectsData).map(([slug, project]) => ({
  label: project.label,
  path: `/school/${slug}`,
  icon: <IconSchool size={20} stroke={1.5} />,
  desc: project.description.length > 80
    ? project.description.slice(0, 80).trim() + '…'
    : project.description,
}))

function ProjectSection({ eyebrow, title, accentWord, description, items }) {
  return (
    <section style={{ marginBottom: '3rem' }}>
      <p style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
        {eyebrow}
      </p>
      <h2 style={{ fontSize: '20px', fontWeight: 500, lineHeight: 1.2, marginBottom: '0.5rem' }}>
        {title} {accentWord && <span style={{ color: 'var(--accent)' }}>{accentWord}</span>}
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '480px', fontSize: '14px' }}>
        {description}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        {items.map(({ label, path, icon, desc }) => (
          <Link
            key={path}
            to={path}
            style={{
              background: 'var(--bg-surface)',
              border: '0.5px solid var(--bg-border)',
              borderRadius: '8px',
              padding: '1rem',
              display: 'block',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--bg-border)'}
          >
            <div style={{ fontSize: '20px', marginBottom: '0.5rem' }}>{icon}</div>
            <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '0.25rem' }}>{label}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{desc}</div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function Home() {
  return (
    <main style={{ maxWidth: '680px', margin: '0 auto', padding: '4rem 2rem' }}>
      <p style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
        Projects
      </p>
      <h1 style={{ fontSize: '28px', fontWeight: 500, lineHeight: 1.2, marginBottom: '2.5rem' }}>
        Things built by <span style={{ color: 'var(--accent)' }}>backwing</span>
      </h1>

      <ProjectSection
        eyebrow="Just for fun"
        title="Personal"
        accentWord="projects"
        description="A small collection of things I've built on my own time: a movie catalogue and a minesweeper game."
        items={personalProjects}
      />

      <ProjectSection
        eyebrow="From my degree"
        title="School"
        accentWord="projects"
        description="Coursework and thesis work from my IT bachelor's."
        items={schoolProjects}
      />
    </main>
  )
}

export default Home
