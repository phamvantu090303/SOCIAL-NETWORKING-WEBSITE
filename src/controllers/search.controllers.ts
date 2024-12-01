import { Response } from 'express'
import { SearchQuery } from '../models/requests/Search.requests'
import CustomRequest from '../type'

import { MediaTypeQuery, PeopleFollow } from '../constants/enums'
import searchService from '../services/search.services'

export const searchController = async (req: CustomRequest<SearchQuery>, res: Response) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  //console.log(req.query.content)

  const result = await searchService.search({
    limit,
    page,
    content: req.query.content as string,
    media_type: req.query.media_type as MediaTypeQuery,
    people_follow: req.query.people_follow as PeopleFollow,
    user_id: req.decoded_authorization?.user_id as string
  })
  res.json({
    message: 'Search Thành Công',
    result: {
      tweets: result.tweets,
      limit,
      page,
      total_page: Math.ceil(result.total / limit) // Tính số trang
    }
  })
}
