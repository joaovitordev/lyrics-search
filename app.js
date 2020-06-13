const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainer = document.querySelector('#songs-container')
const prevAndNextContainer = document.querySelector('#prev-and-next-container')

const apiUrl = `https://api.lyrics.ovh`

// criando requisição padrão
const fetchData = async url => {
    const response = await fetch(url)
    return await response.json()
}

// cors
const getMoreSongs = async url => {
    const data = await fetchData(`https://cors-anywhere.herokuapp.com/${url}`)
    insertSongsIntoPage(data)
}

// inserir botões de next e prev
const insertNextAndPrevButtons = ({ prev, next }) => {
    prevAndNextContainer.innerHTML = `
    ${prev ? `<button class="btn" onclick="getMoreSongs('${prev}')">Anteriores</button>` : '' }
    ${next ? `<button class="btn" onclick="getMoreSongs('${next}')">Próximas</button>` : '' }
`
}

// inserir lis na tela de acordo com a resposta
const insertSongsIntoPage = ({ data, prev, next }) => {
    songsContainer.innerHTML = data.map(({ artist: { name }, title }) => `
        <li class="song">
            <span class="song-artist"><strong>${name}</strong> - ${title}</span>
            <button class="btn" data-artist="${name}" data-song-title="${title}">Ver letra</button>
        </li>
    `).join('')

    // botão prev e next
    if (prev || next) {
        insertNextAndPrevButtons({ prev, next })
        return
    }

    prevAndNextContainer.innerHTML = ''
}

// requisição de acordo com o que foi digitado no input
const fetchSongs = async term => {
    const data = await fetchData(`${apiUrl}/suggest/${term}`)
    insertSongsIntoPage(data)
}

const hendleFormSubmit = event => {
    event.preventDefault()

    // pegando valor digitado e removendo espaços vazios
    const searchTerm = searchInput.value.trim()
    searchInput.value = ''
    searchInput.focus()

    // se tiver vazio a busca retorna uma mensagem
    if (!searchTerm) {
        songsContainer.innerHTML = `<li class="warning-message">Por favor, digite um termo válido</li>`
        return
    }

    // se tiver com valor o input passa pra função fetchSongs o que o usuário digitou
    fetchSongs(searchTerm)
}

// ação do botão buscar
form.addEventListener('submit', hendleFormSubmit)

// inserir informações na página de ver letra
const insertLyricsIntoPage = ({ lyrics, artist, songTitle })  => {
    songsContainer.innerHTML = `
        <li class="lyrics-container">
            <h2><strong>${songTitle}</strong> - ${artist}</h2>
            <p class="lyrics">${lyrics}</p>
        </li>
    `
}

// pegando letra da música e exibindo na tela
const fetchLyrics = async (artist, songTitle) => {
    const data = await fetchData(`${apiUrl}/v1/${artist}/${songTitle}`)
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')
    insertLyricsIntoPage({ lyrics, artist, songTitle })
}

// pegar musica clicada
const hendleSongsContainerClick = event => {
    const clickedElement = event.target

    if (clickedElement.tagName === 'BUTTON') {
        const artist = clickedElement.getAttribute('data-artist')
        const songTitle = clickedElement.getAttribute('data-song-title')

        // remover botão prev e next quando a letra da música for clicada
        prevAndNextContainer.innerHTML = ''

        fetchLyrics(artist, songTitle)
    }
}

// evento de click
songsContainer.addEventListener('click', hendleSongsContainerClick)