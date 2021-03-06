import React, { Component } from 'react'
import { connect } from 'react-redux'
import uuid from 'uuid'
import { dataBaseKey }  from '../../../src/constants.js'
import { fetchSuggestions } from '../../thunks/fetchSuggestions.js'
import SuggestionCard from '../SuggestionCard/SuggestionCard.js'
import './SuggestionsView.css'

export class SuggestionsView extends Component {

  async componentDidMount() {
    const searchRequest = Object.values(this.props.filters).map(query => {
      query = query.split(/[ ]+/).join('+')
      return query
    }).join('+&2c+')
    const category = this.props.category
    const url = `https://cors-anywhere.herokuapp.com/https://tastedive.com/api/similar?q=${searchRequest}&k=${dataBaseKey}&info=1&type=${category}`
    await this.props.fetchSuggestions(url)
  }

  render() {
    return (
      <div className='SuggestionsView'>
        <div className='suggestion-cards-container'>
          {
            this.props.isLoading ? 
              <h1 className='status-msg'>loading...</h1>
            :
            
            this.props.suggestions.Similar ? 
              this.props.suggestions.Similar.Results[0] ?
                this.props.suggestions.Similar.Results.map(suggestion => {
                  return <SuggestionCard {...suggestion} key={uuid()} />
                })
              : <h1 className='status-msg'>Sorry, there were no results!</h1>
            : null
          }
        </div>
      </div>
    )
  }
}

export const mapStateToProps = (state) => {
  return {
    suggestions: state.suggestions,
    filters: state.filters,
    category: state.category,
    isLoading: state.isLoading
  }
}
  
export const mapDispatchToProps = (dispatch) => ({
  fetchSuggestions: (url) => dispatch(fetchSuggestions(url))
})

export default connect(mapStateToProps, mapDispatchToProps)(SuggestionsView)
