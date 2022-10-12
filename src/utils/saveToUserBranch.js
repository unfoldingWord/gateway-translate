import { createUserBranch } from "./createUserBranch";
import { existsUserBranch } from "./existsUserBranch";

// auto generated user branch for gT: `gt-{bookId}-{username}`
export const saveToUserBranch = (bookId, server, owner, data, authentication) => {
  alert("saveToUserBranch")
  console.log("bookId:", bookId)
  console.log("server", server)
  console.log("owner", owner)
  console.log("data", data)
  console.log("authentication", authentication)

  const _userbranch = `gt-${bookId}-${authentication.user.login}`
  console.log("userbranch:", _userbranch)

  // does the user branch exist?
  const branchExists = existsUserBranch(server, owner, data.repo, _userbranch)
  if ( ! branchExists ) {
    const ok = createUserBranch()
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
