import { Component } from 'react'
import styled from 'styled-components'

const ErrorBox = styled.div`
  color: red;
  background: #fbeaea;
  border: 2px solid red;
  border-radius: 5px;
  padding: 20px;
  margin: 20px;
`

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // in a real app this would report to an error-tracking service
    console.error('Uncaught error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorBox>
          <h2>Something went wrong.</h2>
          <p>Sorry about that — please try reloading the page.</p>
        </ErrorBox>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
