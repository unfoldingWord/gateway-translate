

export const createUserBranch = async (owner, repo, branch, repoClient) => {
  const _response = await repoClient.repoCreateBranch(
    owner, 
    repo, 
    {newBranchName: branch, oldBranchName: 'master'},
    {}
  )
  console.log("createUserBranch() response:", _response)
  return true;
};



/*
### createUserBranch

This function will create the user branch above if it does not exist.

Parameters: bookId and username

Returns: true (if created ok) or false (if create fails; also throws exception)

Exception: on any create failure

Code: https://github.com/unfoldingWord/dcs-js/blob/master/apis/repository-api.ts#L1567
*/


/**
 * 
 * @summary Create a branch
 * @param {string} owner owner of the repo
 * @param {string} repo name of the repo
 * @param {CreateBranchRepoOption} [body] 
 * @param {*} [options] Override http request option.
 * @throws {RequiredError}
 */
/*
  repoCreateBranch: async (owner: string, repo: string, body?: CreateBranchRepoOption, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
  ...
  }
*/

/*
export interface CreateBranchRepoOption {
    /**
     * Name of the branch to create
     * @type {string}
     * @memberof CreateBranchRepoOption

    newBranchName: string;
     /**
      * Name of the old branch to create from
      * @type {string}
      * @memberof CreateBranchRepoOption
     oldBranchName?: string;
 }
*/
