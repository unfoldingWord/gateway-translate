

export const existsUserBranch = async (owner, repo, branch, repoClient) => {
  let _response;
  try {
    console.log("existsUserBranch() owner, repo, branch=", owner, repo, branch)
    _response = await repoClient.repoGetBranch({owner: owner, repo: repo, branch: branch})
    console.log("repoGetBranch() ok response:", _response)
  } catch (e) {
    console.log("repoGetBranch() error response:", e)
    return false
  }
  return true;
};

