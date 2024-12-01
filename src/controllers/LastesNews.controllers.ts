import axios from 'axios'
import { config } from 'dotenv'
import { Request, Response } from 'express'
config()
export const lasterNew = async (req: Request, res: Response) => {
  try {
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.KEY_NEW}`
    const response = await axios.get(apiUrl)

    res.status(200).json({
      status: 'success',
      articles: response.data.articles
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      status: 'error',
      message: 'Lỗi khi lấy tin tức'
    })
  }
}
