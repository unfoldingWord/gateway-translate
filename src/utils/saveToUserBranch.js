import base64 from 'base-64'
import utf8 from 'utf8'
import { createUserBranch } from "./createUserBranch";
import { existsUserBranch } from "./existsUserBranch";
import { userbranch } from './userbranch';

// auto generated user branch for gT: `gt-{bookId}-{username}`
export const saveToUserBranch = async (data, owner, content, authentication, repoClient) => {
  const _userbranch = userbranch(data.bookId, authentication.user.login)
  console.log("saveToUserBranch() - userbranch:", _userbranch)
  const _content = base64.encode(utf8.encode(content))

  // does the user branch exist?
  const branchExists = await existsUserBranch(owner, data.repo, _userbranch, repoClient)
  if ( ! branchExists ) {
    console.log("saveToUserBranch() - createUserBranch() branch does not exist, creating", _userbranch)
    const ok = await createUserBranch(owner, data.repo, _userbranch, repoClient)
  }
  // console.log("after branch create, here is the updated content:", _content)
  console.log("saveToUserBranch() - after branch create, here is the data object:", data)
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
  // repoUpdateFile: async (body: UpdateFileOptions, owner: string, 
  //   repo: string, filepath: string, options: AxiosRequestConfig = {})
  const _body = {
    author: {name:`${authentication.user.login}`, email:`${authentication.user.email}`},
    committer: {name:`${authentication.user.login}`, email:`${authentication.user.email}`},
    content: _content, // base64 encoded
    sha: data.content.sha,
    branch: _userbranch
  }
  // the function below returns an object with a new content object.
  // 1. https://github.com/unfoldingWord/dcs-js/tree/master/documentation/classes
  // 2. https://github.com/unfoldingWord/dcs-js/blob/master/documentation/classes/RepositoryApi.md
  // 3. https://github.com/unfoldingWord/dcs-js/blob/master/documentation/classes/RepositoryApi.md#repoupdatefile
  // 4. https://github.com/unfoldingWord/dcs-js/blob/master/documentation/interfaces/FileResponse.md
  // 5. https://github.com/unfoldingWord/dcs-js/blob/master/documentation/interfaces/ContentsResponse.md
  // and finally with the new SHA value:
  // 6. https://github.com/unfoldingWord/dcs-js/blob/master/documentation/interfaces/ContentsResponse.md#sha
  const _data = await repoClient.repoUpdateFile({
    body:_body, 
    owner: owner, 
    repo: data.repo, 
    filepath: data.content.path
  })
  console.log("saveToUserBranch() - After file updated, _data is:", _data)
  _data.data.content.branchExists = true
  _data.data.content.branchName = _userbranch
  return _data.data.content;
};

