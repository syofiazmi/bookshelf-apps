const books = []
const RENDER_EVENT = 'render-book'

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook')
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault()
        addBook()
        this.reset()
    })

    if (isStorageExist()) {
        loadDataFromStorage()
    }
})

document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList')
    incompleteBookshelfList.innerHTML = ''

    const completeBookshelfList = document.getElementById('completeBookshelfList')
    completeBookshelfList.innerHTML = ''

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem)
        if (!bookItem.isCompleted)
            incompleteBookshelfList.append(bookElement)
        else
            completeBookshelfList.append(bookElement)
    }
})

// ADD Book
function addBook() {
    const inputBookTitle = document.getElementById('inputBookTitle').value
    const inputBookAuthor = document.getElementById('inputBookAuthor').value
    const inputBookYear = document.getElementById('inputBookYear').value
    const inputBookState = toggleBook()

    const generateID = generateId()
    const bookObject = generateBookObject(generateID, inputBookTitle, inputBookAuthor, inputBookYear, inputBookState)
    books.push(bookObject)

    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData()
}

function toggleBook() {
    const checkbox = document.getElementById('inputBookIsComplete')

    if (checkbox.checked) return true

    return false
}

// Create Element
function makeBook(bookObject) {
    const textTitle = document.createElement('h3')
    textTitle.innerText = bookObject.title

    const textAuthor = document.createElement('p')
    textAuthor.innerText = bookObject.author

    const textYear = document.createElement('p')
    textYear.innerText = bookObject.year

    const articleElement = document.createElement('article')
    articleElement.classList.add('book_item')
    articleElement.append(textTitle, textAuthor, textYear)
    articleElement.setAttribute('id', `book-${bookObject.id}`)

    if (bookObject.isCompleted) {
        const undoButton = document.createElement('button')
        undoButton.classList.add('green')
        undoButton.innerText = 'Belum selesai dibaca'
        undoButton.addEventListener('click', function () {
            undoBookFromCompleted(bookObject.id)
        })

        const deleteButton = document.createElement('button')
        deleteButton.classList.add('red')
        deleteButton.innerText = 'Hapus buku'
        deleteButton.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id)
        })

        const actionElement = document.createElement('div')
        actionElement.classList.add('action')
        actionElement.append(undoButton, deleteButton)

        articleElement.append(actionElement)

    } else {
        const completeButton = document.createElement('button')
        completeButton.classList.add('green')
        completeButton.innerText = 'Selesai dibaca'
        completeButton.addEventListener('click', function () {
            addBookToCompleted(bookObject.id)
        })

        const deleteButton = document.createElement('button')
        deleteButton.classList.add('red')
        deleteButton.innerText = 'Hapus buku'
        deleteButton.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id)
        })

        const actionElement = document.createElement('div')
        actionElement.classList.add('action')
        actionElement.append(completeButton, deleteButton)

        articleElement.append(actionElement)

    }

    return articleElement
}

function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId)

    if (bookTarget == null) return

    bookTarget.isCompleted = true
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData()
}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId)

    if (bookTarget == null) return

    bookTarget.isCompleted = false
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData()
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId)

    if (bookTarget == -1) return

    books.splice(bookTarget, 1)
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData()
}

// Save to Storage
function saveData() {
    if (isStorageExist) {
        const parsed = JSON.stringify(books)
        localStorage.setItem(STORAGE_KEY, parsed)
        document.dispatchEvent(new Event(SAVED_EVENT))
    }
}

const SAVED_EVENT = 'saved-book'
const STORAGE_KEY = 'BOOKSHELF_APP'

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY))
    const snackbar = document.getElementById('snackbar')
    snackbar.className = 'show'
    setTimeout(function () { snackbar.className = snackbar.className.replace('show', '') }, 3000)
})


function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem
        }
    }

    return null
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id == bookId) {
            return index
        }
    }

    return -1
}

function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId)

    if (bookTarget == null) return

    bookTarget.isCompleted = true
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData()
}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId)

    if (bookTarget == null) return

    bookTarget.isCompleted = false
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData()
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId)

    if (bookTarget == -1) return

    books.splice(bookTarget, 1)
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData()
}

function generateId() {
    return +new Date()
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id, title, author, year, isCompleted
    }
}

// Check the browser support web-storage
function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage')
        return false
    }

    return true
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY)
    let data = JSON.parse(serializedData)

    if (data !== null) {
        for (const buku of data) {
            books.push(buku)
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT))
}
