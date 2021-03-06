window.onload=function(){
  populateDateDropdowns();
}

function populateDateDropdowns() {
  var startDate = document.getElementById("datestart");
  var endDate = document.getElementById("dateend");

  var oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  var startOption = document.createElement("option");
  var startString = oneWeekAgo.toISOString().substr(0,10);
  startOption.text = startString;
  startOption.value = startString;

  var endOption = document.createElement("option");
  var endString = new Date().toISOString().substr(0,10);
  endOption.text = endString;
  endOption.value = endString;

  startDate.appendChild(startOption);
  endDate.appendChild(endOption);
}

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

function getMozBugs(commitURL) {
  mozBugzilla = "https://bugzilla.mozilla.org/";
  whiteboardQuery = "rest/bug?status_whiteboard";

  // FIXME: just use the commit's hash?
  queryString = whiteboardQuery + "=" + commitURL;

  return fetch(mozBugzilla + queryString).then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

// associate commits and associated bugs?
function processCommits(commits) {
  // FIXME: Promise.all, maybe?
  // http://i.imgur.com/Sa1Xoeb.jpg
  for (var commit of commits) {
    // var bugPromise = getMozBugs(commit.html_url);
    console.log("Before bugPromise resolves: " + commit.sha);
    // bugPromise.then(function(bugs) {
    //   console.log("After bugPromise resolves: " +
    //     commit.sha + "bugs.length = " + bugs.length);
    // if (bugs.length > 0) {
    //   for (var bug of bugs) {
    //     console.log("Bug for " + commit.sha + bug.id);
    //   }       
    // } else {
    //   console.log("No bugs for " + commit.sha);
    // }
  }
}

function addCommitsToPage(commits) {
  var commitsTable = document.getElementById("commitsTable");
  var numRows = commitsTable.rows.length;
  for (var rowNum = 0; rowNum < numRows; rowNum++) {
    commitsTable.deleteRow(0);
  }
  for (var commit of commits) {
    var newRow = commitsTable.insertRow();
    var newCell = newRow.insertCell();
    var commitLink = document.createElement("a");
    var linkText = document.createTextNode(commit.commit.message);
    commitLink.appendChild(linkText);
    commitLink.title = linkText;
    commitLink.href = commit.html_url;
    newCell.appendChild(commitLink);
  }
}

function specChangeHandler(event) {
  console.log(event);
  var chosenSpec = "whatwg/" + event.target.value;
  console.log("chosenSpec = " + chosenSpec);
  var selectedStartDate = document.getElementById("datestart");
  var startDate = selectedStartDate.options[selectedStartDate.selectedIndex].text;
  var selectedEndDate = document.getElementById("dateend");
  var endDate = selectedEndDate.options[selectedEndDate.selectedIndex].text;
  var commitPromise = getCommits(chosenSpec, startDate, endDate);
  commitPromise.then(function(commits){addCommitsToPage(commits)});
}