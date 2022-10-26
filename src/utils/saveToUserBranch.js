import { createUserBranch } from "./createUserBranch";
import { existsUserBranch } from "./existsUserBranch";

// auto generated user branch for gT: `gt-{bookId}-{username}`
export const saveToUserBranch = async (data, owner, content, authentication, repoClient) => {
  const _userbranch = `gt-${data.bookId}-${authentication.user.login}`
  console.log("userbranch:", _userbranch)
  const _content = content.toString('base64')

  // does the user branch exist?
  const branchExists = await existsUserBranch(owner, data.repo, _userbranch, repoClient)
  if ( ! branchExists ) {
    console.log("createUserBranch() branch does not exist, creating", _userbranch)
    const ok = await createUserBranch(owner, data.repo, _userbranch, repoClient)
  }
  console.log("after branch create, here is the updated content:", content)
  // console.log("after branch create, here is the data object:", data)
  // console.log("after branch create, here is the auth object:", authentication)

  // update the file with new content
  // repoUpdateFile(owner, repo, filepath, body, options?): Promise<AxiosResponse<FileResponse>>
  // https://github.com/unfoldingWord/dcs-js/blob/master/documentation/interfaces/UpdateFileOptions.md:
  // author
  // branch
  // committer
  // content
  // dates
  // from_path
  // message
  // new_branch
  // sha
  // signoff
  const _body = {
    author: `${authentication.user.login}`,
    committer: `${authentication.user.login}`,
    content: _content, // base64 encoded
    sha: data.content.sha,
  }
  repoClient.repoUpdateFile(owner, data.repo, data.content.path, JSON.stringify(_body), {})

  return true;
};

/* Design Notes
This function saves the supplied content to the user branch.

Parameters: 
- bookId
- username
- content type ("perf" or "usfm")
- content

Returns: true or false (on failure to save)

Exception: on failure to save an exception will be thrown

Code: https://github.com/unfoldingWord/dcs-js/blob/master/apis/repository-api.ts#L18759

*/
