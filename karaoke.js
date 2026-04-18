let queue = JSON.parse(localStorage.getItem("queue")) || [];
const empty = "No song is currently playing!";
const queueList = document.getElementById("queue");
const selectList = document.getElementById("delete");

async function searchYouTube(query) {
  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('q', query);
  url.searchParams.set('type', 'video');
  url.searchParams.set('maxResults', '6');
  url.searchParams.set('key', API_KEY);
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`YouTube API error: ${response.status}`);
    const data = await response.json();
    displayResults(data.items || []);
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
  }
}

function displayResults(items) {
  const resultsBox = document.getElementById('searchresults');
  resultsBox.innerHTML = '';
  items.forEach(item => {
    const videoId = item.id.videoId;
    const li = document.createElement('li');
    const fig = document.createElement("figure");
    const figcap = document.createElement("figcaption");
    const thumb = document.createElement("img");
    thumb.width = "200";
    thumb.height = "150";
    thumb.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    figcap.innerHTML = `${item.snippet.title}`;
    fig.appendChild(thumb);
    fig.appendChild(figcap);
    fig.classList.add("video-option");
    fig.tabIndex = 0;
    fig.role = "button";
    fig.addEventListener("click", function() {
        setVideo(videoId);
    });
    fig.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            setVideo(videoId);
        }
    });
    resultsBox.appendChild(fig);
  });
}

function setVideo(id) {
    const video = document.getElementById("video");
    if (id) {
        video.hidden = false;
        video.src = `https://www.youtube.com/embed/${id}`;
    } else {
        video.hidden = true;
    }
}

function clearQueue() {
    localStorage.clear();
    queue = [];
    queueList.innerHTML = "";
    selectList.innerHTML = "";
    document.getElementById("current-song").textContent = empty;
}

function clearResults() {
    const searchresults = document.getElementById("searchresults");
    searchresults.innerHTML = "";
}

function showQueue() {
    queueList.innerHTML = "";
    selectList.innerHTML = "";
    queue.forEach((entry, index) => {
        let newEntry = document.createElement("option");
        newEntry.textContent = `${entry.name} singing ${entry.song}`;
        newEntry.value = index;
        selectList.appendChild(newEntry);
    });
    queue.forEach(entry => {
        let newEntry = document.createElement("li");
        newEntry.innerHTML = `${entry.name} singing <a target="_blank" href="https://www.youtube.com/results?search_query=${entry.song} karaoke">${entry.song}</a>`;
        queueList.appendChild(newEntry);
    });
}

function addToQueue() {
    let nameField = document.getElementById("name");
    let songField = document.getElementById("song");
    queue.push({name: nameField.value, song: songField.value});
    localStorage.setItem("queue", JSON.stringify(queue));
    nameField.value = "";
    songField.value = "";
    showQueue();
}

function next() {
    const current = document.getElementById("current-song");
    if (queue.length == 0) {
        current.textContent = empty;
    } else {
        let entry = queue.shift();
        let songLink = document.createElement("a");
        songLink.href = `https://www.youtube.com/results?search_query=${entry.song} karaoke`;
        songLink.target = "_blank";
        songLink.innerHTML = `${entry.song}`
        current.textContent = `Current song: ${entry.name} singing `;
        current.appendChild(songLink);
        document.getElementById('videobox').hidden = false;
        searchYouTube(`${entry.song} karaoke`);
    }
    showQueue()
}

function deleteSelection(selection) {
    queue.splice(selection, 1)
    showQueue();
}
window.onload = showQueue();
