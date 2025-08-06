async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    let songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            let songName = element.href.split("/songs/")[1]; // fixed here
            songs.push({
                name: decodeURIComponent(songName),
                url: element.href
            });
        }
    }

    return songs;
}

async function main() {
    let currentSong;
    let songs = await getSongs();
    console.log(songs);

    let songUL = document.querySelector(".songlist ul");
    let audio = document.getElementById("audioPlayer");

    for (const song of songs) {
        let li = document.createElement("li");
        li.innerText = song.name;
        li.style.cursor = "pointer";

        li.addEventListener("click", () => {
            document.querySelectorAll('.songlist li').forEach(li => li.classList.remove('playing'));
            li.classList.add('playing');

            audio.src = song.url;
            audio.play();
            currentSong = song;
            console.log("Now playing:", song.name);
        });

        songUL.appendChild(li);
    }

    let play = document.querySelector(".play");
    let pause = document.querySelector(".pause");

    play.addEventListener("click", () => {
        audio.play()
    }
    )

    pause.addEventListener("click", () => {
        audio.pause()
    }
    )

    let currentSongIndex = 0;

    let nextBtn = document.querySelector(".next");

    nextBtn.addEventListener("click", () => {
        if (currentSongIndex < songs.length - 1) {
            currentSongIndex++;
        } else {
            currentSongIndex = 0;
        }

        audio.src = songs[currentSongIndex].url;
        audio.play();
    });

    let prevBtn = document.querySelector(".prev");

    prevBtn.addEventListener("click", () => {
        if (currentSongIndex > 0) {
            currentSongIndex--;
        } else {
            currentSongIndex = songs.length - 1;
        }

        audio.src = songs[currentSongIndex].url;
        audio.play();
    });

    let seekBar = document.querySelector(".seek");
    let circle = document.querySelector(".circle");
    let isDragging = false;

    circle.addEventListener("mousedown", (e) => {
        isDragging = true;
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            let rect = seekBar.getBoundingClientRect();
            let offsetX = e.clientX - rect.left;

            // Clamp value between 0 and seekBar width
            offsetX = Math.max(0, Math.min(offsetX, seekBar.offsetWidth));

            let percent = (offsetX / seekBar.offsetWidth) * 100;
            circle.style.left = `${percent}%`;

        }
    });

    document.addEventListener("mouseup", (e) => {
        if (isDragging) {
            isDragging = false;

            let rect = seekBar.getBoundingClientRect();
            let offsetX = e.clientX - rect.left;
            offsetX = Math.max(0, Math.min(offsetX, seekBar.offsetWidth));

            let percent = (offsetX / seekBar.offsetWidth) * 100;
            let newTime = (percent / 100) * audio.duration;
            audio.currentTime = newTime;
        }
    });

    audio.addEventListener('timeupdate', () => {
        let percent = (audio.currentTime / audio.duration) * 100;
        circle.style.left = `${percent}%`;
    });


}
main()
