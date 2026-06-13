import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { tmdb_id, rating, review } = req.body
    const { data, error } = await supabase
      .from('watched_movies')
      .insert([{ tmdb_id, rating, review }])
    if (error) return res.status(500).json({ error })
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { id } = req.body
    const { data, error } = await supabase
      .from('watched_movies')
      .delete()
      .eq('id', id)
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