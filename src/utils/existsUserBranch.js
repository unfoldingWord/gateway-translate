

export const existsUserBranch = async (owner, repo, branch, repoClient) => {
  let _response;
  try {
    _response = await repoClient.repoGetBranch({owner: owner, repo: repo, branch: branch})
  } catch (e) {
    console.log("repoGetBranch() error response:", e)
    return false
  }
  return true;
};

