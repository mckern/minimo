import Fuse from 'fuse.js'

import {
  appendResults,
  getJSON,
  getUrlSearchParam,
  setSearchingIndicator
} from './helpers'

const doSearch = (term, fuse, resultsBlock) => {
  setSearchingIndicator(resultsBlock)

  let results = term
    ? fuse
        .search(term)
        .map(function (result) {
            return ({ href: result.item.href, title: result.item.title })
          })
    : []

  appendResults(results, resultsBlock)
}

const options = {
  shouldSort: true,
  threshold: 0.4,
  location: 0,
  distance: 500,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [{ name: 'title', weight: 0.5 }, { name: 'content', weight: 0.5 }]
}

const searchInputBox = document.getElementById('search-term')
const resultsBlock = document.getElementById('search-results')

let term = getUrlSearchParam('q')
searchInputBox.value = term
searchInputBox.focus()

setSearchingIndicator(resultsBlock)

getJSON(`${window.location.pathname}index.json`, (err, list) => {
  if (err) {
    console.error(err)
    return
  }

  let fuse = new Fuse(list, options)

  doSearch(term, fuse, resultsBlock)

  searchInputBox.addEventListener('input', e => {
    doSearch(e.target.value, fuse, resultsBlock)
  })
})
