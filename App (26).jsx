import { useState, useEffect } from 'react'
import countryService from './services/countries'
import CountryList from './components/CountryList'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    countryService.getAll().then(data => setCountries(data))
  }, [])

  const countriesToShow = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <div>
        find countries <input value={filter} onChange={e => setFilter(e.target.value)} />
      </div>

      {filter && (
        // key=filter forces a clean remount whenever the search term changes,
        // so a previously "shown" single country does not linger between searches
        <CountryList key={filter} countries={countriesToShow} />
      )}
    </div>
  )
}

export default App
