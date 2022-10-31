import base64 from 'base-64'
import utf8 from 'utf8'
import { createUserBranch } from "./createUserBranch";
import { existsUserBranch } from "./existsUserBranch";
import { userbranch } from './userbranch';

// auto generated user branch for gT: `gt-{bookId}-{username}`
export const saveToUserBranch = async (data, owner, content, authentication, repoClient) => {
  const _userbranch = userbranch(data.bookId, authentication.user.login)
  console.log("userbranch:", _userbranch)
  const _content = base64.encode(utf8.encode(content))

  // does the user branch exist?
  const branchExists = await existsUserBranch(owner, data.repo, _userbranch, repoClient)
  if ( ! branchExists ) {
    console.log("createUserBranch() branch does not exist, creating", _userbranch)
    const ok = await createUserBranch(owner, data.repo, _userbranch, repoClient)
  }
  // console.log("after branch create, here is the updated content:", _content)
  console.log("after branch create, here is the data object:", data)
  console.log("after branch create, here is the auth object:", authentication)

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
  repoClient.repoUpdateFile(_body, owner, data.repo, data.content.path, {})

  return true;
};

