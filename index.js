const core = require("@actions/core");
const github = require("@actions/github");

async function indicateProcessing(octokit, repo, target){
    await octokit.rest.reactions.createForIssue({
        owner: repo.owner,
        repo: repo.repo,
        issue_number: target.number,
        content: "eyes"
    })
    core.info("Indicated processing");
}

async function run(){
    try{
        const token = core.getInput("token");
        const octokit = github.getOctokit(token);

        const repo = github.context.repo;
        const target = github.context.payload.issue;
        const endpoint = core.getInput("endpoint");

        const payload = {
            token: core.getInput("token"),
            repository: core.getInput("repository"),
            context: github.context
          };

        core.debug('Payload: ' + JSON.stringify(payload));

        // Indicator will be removed from backend once the target is processed
        await indicateProcessing(octokit, repo, target);

        const response = await fetch(endpoint, {
            method: 'POST',
            body: payload,
            headers: {
              'Content-Type': 'application/json'
            }
          });

        if(!response.ok){
            core.setFailed(`HTTP error: ${response.status}`);
        }
        core.debug(response);

    } catch(error){
        core.debug(error);
        core.setFailed(error.message);
    }
}
run();