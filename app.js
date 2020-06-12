const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainer = document.querySelector('#songs-container')
const prevAndNextContainer = document.querySelector('#prov-and-next-container')

const apiUrl = `http://api.lyrics.ovh`

const fetchSongs = async term => {
    const response = await fetch(`${apiUrl}/suggests/${term}`)
    const data = await response.json()
}

form.addEventListener('submit', event => {
    event.preventDefault()

    const searchTerm = searchInput.value.trim()

    if (!searchTerm) {
        songsContainer.innerHTML = `<li class="warning-message">Por favor, digite um termo válido</li>`
        return
    }

    fetchSongs(searchTerm)
})