import { existsUserBranch } from "./existsUserBranch";
import { userbranch } from './userbranch';

/*
    This function assumes that the user has previously edited the file and
    is continuing to edit the same file. So this function will:
    - first see if the user branch exist and get the file from there
    - otherwise, get the file from the master branch.

    For the present, it stops and shows a message if the master branch
    does not have the file. In the future, the code may be exanded to obtain
    the file from a released source.
*/
export const fetchFromUserBranch = async (owner, repo, filename, bookId, authentication, repoClient) => {
  const _userbranch = userbranch(bookId, authentication.user.login)
  console.log("userbranch:", _userbranch)

  // does the user branch exist?
  let _content
  const branchExists = await existsUserBranch(owner, repo, _userbranch, repoClient)
  if ( branchExists ) {
    // get data from user branch
    console.log("fetch...() branchExists is true. owner, repo=", owner, repo)
    _content = await repoClient.repoGetContents(
        {owner, owner,repo: repo, filepath: filename, ref:_userbranch}
    ).then(({ data }) => data)
    _content.branchExists = true
    _content.branchName = _userbranch
  } else {
    // get data from master branch
    console.log("fetch...() branchExists is not true, fetch from master (default) branch")
    _content = await repoClient.repoGetContents(
        {owner: owner,repo: repo,filepath: filename}
    ).then(({ data }) => data)
    _content.branchExists = false
  }
  return _content
}