

export const existsUserBranch = async (owner, repo, branch, repoClient) => {
  let _response;
  try {
    _response = await repoClient.repoGetBranch(owner, repo, branch)
    console.log("repoGetBranch() ok response:", _response)
  } catch (e) {
    console.log("repoGetBranch() error response:", e)
    return false
  }
  return true;
};

/* Design Notes
### existsUserBranch

This function will test to see if a user branch exists. We need a naming convention for these branches since they will be created by the app if they don't exist.

So how about `gt-{bookId}-{username}`?

Parameters: bookId and username.

Returns: true or false. 

Exception: on any system failures.

Code: https://github.com/unfoldingWord/dcs-js/blob/master/apis/repository-api.ts#L18344 or https://github.com/unfoldingWord/dcs-js/blob/master/apis/repository-api.ts#L11825

*/

/* dcs docs
       /**
         * 
         * @summary Search for repositories
         * @param {string} [q] keyword
         * @param {boolean} [topic] Limit search to repositories with keyword as topic
         * @param {boolean} [includeDesc] include search of keyword within repository description (defaults to false)
         * @param {number} [uid] search only for repos that the user with the given id owns or contributes to
         * @param {number} [priorityOwnerId] repo owner to prioritize in the results
         * @param {number} [teamId] search only for repos that belong to the given team id
         * @param {number} [starredBy] search only for repos that the user with the given id has starred
         * @param {boolean} [_private] include private repositories this user has access to (defaults to true)
         * @param {boolean} [isPrivate] show only pubic, private or all repositories (defaults to all)
         * @param {boolean} [template] include template repositories this user has access to (defaults to true)
         * @param {boolean} [archived] show only archived, non-archived or all repositories (defaults to all)
         * @param {string} [mode] type of repository to search for. Supported values are \&quot;fork\&quot;, \&quot;source\&quot;, \&quot;mirror\&quot; and \&quot;collaborative\&quot;
         * @param {boolean} [exclusive] if &#x60;uid&#x60; is given, search only for repos that the user owns
         * @param {string} [repo] name of the repo. Multiple repo&#x27;s are ORed.
         * @param {string} [owner] owner of the repo. Multiple owner&#x27;s are ORed.
         * @param {string} [lang] If the repo is a resource of the given language(s), the repo will be in the results. Multiple lang&#x27;s are ORed.
         * @param {string} [subject] resource subject. Multiple subject&#x27;s are ORed.
         * @param {string} [book] book (project id) that exist in a resource. If the resource contains the the book, its repository will be included in the results. Multiple book&#x27;s are ORed.
         * @param {boolean} [includeMetadata] if false, q value will only be searched for in the repo name, owner, description and title and subject; otherwise search all values of the manifest file. (defaults to false)
         * @param {string} [sort] sort repos by attribute. Supported values are \&quot;alpha\&quot;, \&quot;created\&quot;, \&quot;updated\&quot;, \&quot;size\&quot;, and \&quot;id\&quot;. Default is \&quot;alpha\&quot;
         * @param {string} [order] sort order, either \&quot;asc\&quot; (ascending) or \&quot;desc\&quot; (descending). Default is \&quot;asc\&quot;, ignored if \&quot;sort\&quot; is not specified.
         * @param {number} [page] page number of results to return (1-based)
         * @param {number} [limit] page size of results
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
/*
        repoSearch: async (q?: string, topic?: boolean, includeDesc?: boolean, uid?: number, priorityOwnerId?: number, teamId?: number, starredBy?: number, _private?: boolean, isPrivate?: boolean, template?: boolean, archived?: boolean, mode?: string, exclusive?: boolean, repo?: string, owner?: string, lang?: string, subject?: string, book?: string, includeMetadata?: boolean, sort?: string, order?: string, page?: number, limit?: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {

*/
