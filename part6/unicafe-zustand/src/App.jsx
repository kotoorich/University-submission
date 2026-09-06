import { useGood, useNeutral, useBad, useFeedbackActions } from './store'

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const Statistics = () => {
  const good = useGood()
  const neutral = useNeutral()
  const bad = useBad()
  const total = good + neutral + bad

  if (total === 0) {
    return <p>No feedback given</p>
  }

  const average = (good - bad) / total
  const positivePercentage = (good / total) * 100

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={total} />
        <StatisticLine text="average" value={average} />
        <StatisticLine text="positive" value={`${positivePercentage} %`} />
      </tbody>
    </table>
  )
}

const App = () => {
  const { good, neutral, bad } = useFeedbackActions()

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={good} text="good" />
      <Button onClick={neutral} text="neutral" />
      <Button onClick={bad} text="bad" />

      <h1>statistics</h1>
      <Statistics />
    </div>
  )
}

export default App
