const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainer = document.querySelector('#songs-container')
const prevAndNextContainer = document.querySelector('#prov-and-next-container')

const apiUrl = `http://api.lyrics.ovh`

form.addEventListener('submit', event => {
    event.preventDefault()

    const searchTerm = searchInput.nodeValue.trim()
})