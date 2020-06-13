const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainer = document.querySelector('#songs-container')
const prevAndNextContainer = document.querySelector('#prev-and-next-container')

const apiUrl = `https://api.lyrics.ovh`

// cors
const getMoreSongs = async url => {
    const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`)
    const data = await response.json()

    insertSongsIntoPage(data)
}

// inserir lis na tela de acordo com a resposta
const insertSongsIntoPage = songsInfo => {
    songsContainer.innerHTML = songsInfo.data.map(song => `
        <li class="song">
            <span class="song-artist"><strong>${song.artist.name}</strong> - ${song.title}</span>
            <button class="btn" data-artist="${song.artist.name}" data-song-title="${song.title}">Ver letra</button>
        </li>
    `).join('')

    // botão prev e next
    if (songsInfo.prev || songsInfo.next) {
        prevAndNextContainer.innerHTML = `
            ${songsInfo.prev ? `<button class="btn" onclick="getMoreSongs('${songsInfo.prev}')">Anteriores</button>` : '' }
            ${songsInfo.next ? `<button class="btn" onclick="getMoreSongs('${songsInfo.next}')">Próximas</button>` : '' }
        `
        return
    }

    prevAndNextContainer.innerHTML = ''
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

// pegando letra da música e exibindo na tela
const fetchLyrics = async (artist, songTitle) => {
    const response = await fetch(`${apiUrl}/v1/${artist}/${songTitle}`)
    const data = await response.json()
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')

    songsContainer.innerHTML = `
        <li class="lyrics-container">
            <h2><strong>${songTitle}</strong> - ${artist}</h2>
            <p class="lyrics">${lyrics}</p>
        </li>
    `
}

// pegar música clicada
songsContainer.addEventListener('click', event => {
    const clickedElement = event.target

    if (clickedElement.tagName === 'BUTTON') {
        const artist = clickedElement.getAttribute('data-artist')
        const songTitle = clickedElement.getAttribute('data-song-title')

        // remover botão prev e next quando a letra da música for clicada
        prevAndNextContainer.innerHTML = ''

        fetchLyrics(artist, songTitle)
    }
})