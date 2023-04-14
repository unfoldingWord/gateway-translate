
export const userbranch = (bookId, username) => {
    return `auto-${username}-${bookId.toUpperCase()}`
}
