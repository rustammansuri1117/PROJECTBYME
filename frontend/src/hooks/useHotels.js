import { useEffect, useState } from 'react'
import { fetchHotels, toQueryString } from '../api/hotels'

/**
 * Loads one page of hotels from the API.
 * `params` = { search, location, maxPrice, page, limit, ... }
 * Re-fetches whenever the params change, or when reload() is called.
 */
export default function useHotels(params) {
  const [reloadToken, setReloadToken] = useState(0)
  const [state, setState] = useState({ key: null, hotels: [], pagination: null, error: '' })

  const queryString = toQueryString(params)
  const key = `${queryString}#${reloadToken}`

  useEffect(() => {
    let ignore = false

    fetchHotels(queryString)
      .then((res) => {
        if (!ignore) setState({ key, hotels: res.data, pagination: res.pagination, error: '' })
      })
      .catch((err) => {
        if (!ignore) setState({ key, hotels: [], pagination: null, error: err.message })
      })

    return () => {
      ignore = true
    }
  }, [key, queryString])

  return {
    hotels: state.hotels,
    pagination: state.pagination,
    error: state.error,
    loading: state.key !== key, // true until the response for the current key arrives
    reload: () => setReloadToken((t) => t + 1),
  }
}
