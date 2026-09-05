import { useState } from 'react'
import CountryDetails from './CountryDetails'

const CountryList = ({ countries }) => {
  const [shown, setShown] = useState(null)

  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length === 1) {
    return <CountryDetails country={countries[0]} />
  }

  if (shown) {
    const country = countries.find(c => c.cca3 === shown)
    if (country) {
      return <CountryDetails country={country} />
    }
  }

  return (
    <div>
      {countries.map(country => (
        <div key={country.cca3}>
          {country.name.common}
          <button onClick={() => setShown(country.cca3)}>show</button>
        </div>
      ))}
    </div>
  )
}

export default CountryList
