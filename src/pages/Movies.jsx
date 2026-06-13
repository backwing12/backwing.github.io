import { useEffect, useState } from 'react'

function Movies() {
  const [movie, setMovie] = useState(null)

  useEffect(() => {
    fetch('/api/movie?endpoint=movie/550?language=en-US')
      .then(res => res.json())
      .then(data => setMovie(data))
  }, [])

  return (
    <main style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 2rem' }}>
      <h1>Movies test</h1>
      {movie ? (
        <pre>{JSON.stringify(movie, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </main>
  )
}

export default Movies