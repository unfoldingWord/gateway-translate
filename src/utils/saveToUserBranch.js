import { createUserBranch } from "./createUserBranch";
import { existsUserBranch } from "./existsUserBranch";

// auto generated user branch for gT: `gt-{bookId}-{username}`
export const saveToUserBranch = async (bookId, owner, data, authentication, repoClient) => {
  alert("saveToUserBranch")
  console.log("bookId:", bookId)
  console.log("owner", owner)
  console.log("data", data)
  console.log("authentication", authentication)

  const _userbranch = `gt-${bookId}-${authentication.user.login}`
  console.log("userbranch:", _userbranch)

  // does the user branch exist?
  const branchExists = await existsUserBranch(owner, data.repo, _userbranch, repoClient)
  console.log("saveToUserBranch() branchExists:", branchExists)
  if ( ! branchExists ) {
    console.log("will do createUserBranch()")
    const ok = await createUserBranch(owner, data.repo, _userbranch, repoClient)
  }
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
