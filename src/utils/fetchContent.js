export const fetchContent = async (catalogEntry, bookId, repoClient) => {
  if (!catalogEntry || !catalogEntry.ingredients.length || !bookId) {
    return "No valid branch or tag"
  }
  let _content
  let filepath
  catalogEntry.ingredients.forEach(ingredient => {
    if (ingredient.identifier == bookId) {
      filepath = ingredient.path
    }
  })
  if (!filepath) {
    return "Book now found in repository"
  }
  // get data from user branch
  console.log("calling repoGetContents(", catalogEntry.owner, catalogEntry.repo.name, filepath, catalogEntry.commit_sha, ")")
  _content = await repoClient.repoGetContents({owner: catalogEntry.owner, repo: catalogEntry.repo.name, filepath, ref: catalogEntry.commit_sha}).then(({ data }) => data)
  return _content
}