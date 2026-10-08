import { useParams, Link } from 'react-router-dom'
import { IconArrowLeft, IconBrandGithub, IconExternalLink } from '@tabler/icons-react'
import { schoolProjectsData } from '../data/SchoolProjectsData'

function SchoolProject() {
  const { slug } = useParams()
  const project = schoolProjectsData[slug]

  if (!project) {
    return (
      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '4rem 2rem' }}>
        <p>Project not found.</p>
        <Link to="/" style={{ color: 'var(--accent)' }}>Back to projects</Link>
      </main>
    )
  }

  const { label, semester, title, description, tech, groupSize, image, links } = project

  return (
    <main style={{ maxWidth: '680px', margin: '0 auto', padding: '4rem 2rem' }}>
      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          color: 'var(--text-muted)',
          fontSize: '13px',
          marginBottom: '2rem',
          textDecoration: 'none',
        }}
      >
        <IconArrowLeft size={16} stroke={1.5} />
        Back to projects
      </Link>

      {image && (
        <div style={{
          width: '100%',
          aspectRatio: '16 / 10',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '0.5px solid var(--bg-border)',
          marginBottom: '1.5rem',
          background: 'var(--bg-surface)',
        }}>
          <img
            src={image}
            alt={`Screenshot of ${title}`}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
          />
        </div>
      )}

      <p style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
        {label} · {semester}
      </p>
      <h1 style={{ fontSize: '26px', fontWeight: 500, lineHeight: 1.2, marginBottom: '1rem' }}>
        {title}
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '520px' }}>
        {description}
      </p>

      {tech?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.5rem' }}>
          {tech.map((t) => (
            <span
              key={t}
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                border: '0.5px solid var(--bg-border)',
                borderRadius: '999px',
                padding: '0.2rem 0.65rem',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        {groupSize > 1 ? `Group project (${groupSize} people)` : 'Solo project'}
      </p>

      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {links?.github && (
          <a
            href={links.github}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '13px',
              color: 'var(--accent)',
              textDecoration: 'none',
            }}
          >
            <IconBrandGithub size={16} stroke={1.5} />
            View on GitHub
          </a>
        )}

        {links?.live && (
          <a
            href={links.live}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '13px',
              color: 'var(--accent)',
              textDecoration: 'none',
            }}
          >
            <IconExternalLink size={16} stroke={1.5} />
            View live demo
          </a>
        )}
      </div>
    </main>
  )
}

export default SchoolProject