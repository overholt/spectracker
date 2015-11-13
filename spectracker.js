function getCommits(repo, since, until) {
  repoURL = "https://api.github.com/repos/" + repo + "/";
  commitsQuery = "commits?";
  commitsQuery += "since=" + since;
  commitsQuery += "&until=" + until;
  
  queryURL = repoURL + commitsQuery;
  
  return fetch(queryURL).then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

function getBugs(commitURL) {
  mozBugzilla = "https://bugzilla.mozilla.org/";
  whiteboardQuery = "rest/bug?status_whiteboard";
  
  queryString = whiteboardQuery + "=" + commitURL;
  
  return fetch(mozBugzilla + queryString).then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

function processCommits(commits) {
  for (var commit of commits) {
    // var bugPromise = getBugs(commit.html_url);
    console.log("Before bugPromise resolves: " + commit.sha);
    // bugPromise.then(function(bugs) {
    //   console.log("After bugPromise resolves: " + commit.sha + "bugs.length = " + bugs.length);
      // if (bugs.length > 0) {
      //   for (var bug of bugs) {
      //     console.log("Bug for " + commit.sha + bug.id);
      //   }       
      // } else {
      //   console.log("No bugs for " + commit.sha);
      // }
    }
  }

// do some sort of Promise.all?
// associate commits and associated bugs?

var commitPromise = getCommits("whatwg/html", "2015-10-01", "2015-11-12");
commitPromise.then(function(commits){processCommits(commits)});