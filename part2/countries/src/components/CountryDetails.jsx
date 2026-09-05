import Weather from './Weather'

const CountryDetails = ({ country }) => {
  const languages = Object.values(country.languages || {})
  const capital = country.capital ? country.capital[0] : null

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {capital}</p>
      <p>area {country.area}</p>

      <h3>languages</h3>
      <ul>
        {languages.map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img
        src={country.flags.png}
        alt={`flag of ${country.name.common}`}
        width={150}
      />

      {capital && <Weather capital={capital} />}
    </div>
  )
}

export default CountryDetails
