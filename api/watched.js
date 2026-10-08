import { createClient } from '@supabase/supabase-js'
import { verifyToken } from './_verify.js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  const token = req.headers['x-admin-token']
  if (!token || !verifyToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  if (req.method === 'POST') {
    const { tmdb_id, rating, review } = req.body
    const { data, error } = await supabase
      .from('watched_movies')
      .insert([{ tmdb_id, rating, review }])
    // 23505 = unique violation (once tmdb_id has a unique constraint)
    if (error?.code === '23505') return res.status(409).json({ error: 'Already in watched list' })
    if (error) return res.status(500).json({ error })
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { id } = req.body
    const numericId = parseInt(id)
    const { data, error } = await supabase
      .from('watched_movies')
      .delete()
      .eq('id', numericId)
    if (error) return res.status(500).json({ error })
    return res.status(200).json(data)
  }

  if (req.method === 'PATCH') {
    const { id, rating, review } = req.body
    const { data, error } = await supabase
      .from('watched_movies')
      .update({ rating, review })
      .eq('id', id)
    if (error) return res.status(500).json({ error })
    return res.status(200).json(data)
  }

  res.status(405).json({ error: 'Method not allowed' })
}