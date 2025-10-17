let books = [];
const STORAGE_KEY = "BOOKSHELF_APPS";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-testid='bookForm']");
  const searchButton = document.querySelector("[data-testid='searchBookFormSubmitButton']");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    addBook();
  });

  searchButton.addEventListener("click", searchBook);

  // Load data dari localStorage
  if (localStorage.getItem(STORAGE_KEY)) {
    books = JSON.parse(localStorage.getItem(STORAGE_KEY));
  }
  document.dispatchEvent(new Event("render-book"));
});

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function addBook() {
  const title = document.querySelector("[data-testid='bookFormTitleInput']").value.trim();
  const author = document.querySelector("[data-testid='bookFormAuthorInput']").value.trim();
  const year = document.querySelector("[data-testid='bookFormYearInput']").value.trim();
  const isComplete = document.querySelector("[data-testid='bookFormIsCompleteCheckbox']").checked;

  if (!title || !author || !year) {
    alert("Semua field wajib diisi!");
    return;
  }

  const book = {
    id: +new Date(),
    title,
    author,
    year: Number(year),
    isComplete,
  };

  books.push(book);
  saveData();
  document.dispatchEvent(new Event("render-book"));
  document.querySelector("[data-testid='bookForm']").reset();
}

document.addEventListener("render-book", () => {
  const incompleteList = document.querySelector("[data-testid='incompleteBookList']");
  const completeList = document.querySelector("[data-testid='completeBookList']");

  incompleteList.innerHTML = "";
  completeList.innerHTML = "";

  for (const book of books) {
    const bookElement = createBookElement(book);
    if (book.isComplete) completeList.append(bookElement);
    else incompleteList.append(bookElement);
  }
});

function createBookElement(book) {
  const bookDiv = document.createElement("div");
  bookDiv.classList.add("book_item");
  bookDiv.setAttribute("data-id", book.id);
  bookDiv.innerHTML = `
    <h3>${book.title}</h3>
    <p>Penulis: ${book.author}</p>
    <p>Tahun: ${book.year}</p>
  `;

  const toggleButton = document.createElement("button");
  toggleButton.textContent = book.isComplete
    ? "Belum selesai dibaca"
    : "Selesai dibaca";
  toggleButton.addEventListener("click", () => moveBook(book.id));

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Hapus";
  deleteButton.addEventListener("click", () => {
    removeBook(book.id);
  });

  bookDiv.append(toggleButton, deleteButton);
  return bookDiv;
}

function moveBook(id) {
  const book = books.find((b) => b.id === id);
  if (!book) return;
  book.isComplete = !book.isComplete;
  saveData();
  document.dispatchEvent(new Event("render-book"));
}

function removeBook(id) {
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) return;

  const confirmDelete = confirm("Apakah Anda yakin ingin menghapus buku ini?");
  if (confirmDelete) {
    books.splice(index, 1);
    saveData();
    document.dispatchEvent(new Event("render-book"));
  }
}

function searchBook() {
  const keyword = document
    .querySelector("[data-testid='searchBookFormTitleInput']")
    .value.toLowerCase()
    .trim();

  const incompleteList = document.querySelector("[data-testid='incompleteBookList']");
  const completeList = document.querySelector("[data-testid='completeBookList']");

  incompleteList.innerHTML = "";
  completeList.innerHTML = "";

  const filtered = books.filter((b) =>
    b.title.toLowerCase().includes(keyword)
  );

  for (const book of filtered) {
    const bookElement = createBookElement(book);
    if (book.isComplete) completeList.append(bookElement);
    else incompleteList.append(bookElement);
  }

  if (keyword === "") {
    document.dispatchEvent(new Event("render-book"));
  }
}
