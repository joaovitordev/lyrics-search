const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainer = document.querySelector('#songs-container')
const prevAndNextContainer = document.querySelector('#prov-and-next-container')

const apiUrl = `https://api.lyrics.ovh`

const insertSongsIntoPage = songsInfo => {
    songsContainer.innerHTML = songsInfo.data.map(song => `
        <li class="song">
            <span class="song-artist"><strong>${song.artist.name}</strong> - ${song.title}</span>
            <button class="btn" data-artist="${song.artist.name}" data-song-title="${song.title}">Ver letra</button>
        </li>
    `).join('')
}

// requisição de acordo com o que foi digitado no input
const fetchSongs = async term => {
    const response = await fetch(`${apiUrl}/suggest/${term}`)
    const data = await response.json()

    insertSongsIntoPage(data)
}

// ação do botão buscar
form.addEventListener('submit', event => {
    event.preventDefault()

    // pegando valor digitado e removendo espaços vazios
    const searchTerm = searchInput.value.trim()

    // se tiver vazio a busca retorna uma mensagem
    if (!searchTerm) {
        songsContainer.innerHTML = `<li class="warning-message">Por favor, digite um termo válido</li>`
        return
    }

    // se tiver com valor o input passa pra função fetchSongs o que o usuário digitou
    fetchSongs(searchTerm)
})