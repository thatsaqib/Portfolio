document.addEventListener("DOMContentLoaded", () => {
    const screen = document.querySelector(".screen");
    const themeToggle = document.getElementById("themeToggle");
    let errorState = false;

    // Theme toggle
    themeToggle.addEventListener("click", () => {
        if (document.body.classList.contains("dark")) {
            document.body.classList.replace("dark", "light");
            themeToggle.textContent = "☀️";
        } else {
            document.body.classList.replace("light", "dark");
            themeToggle.textContent = "🌙";
        }
    });

    const adjustFont = () => {
        const len = screen.textContent.length;
        if (len <= 8) screen.style.fontSize = "2rem";
        else if (len <= 12) screen.style.fontSize = "1.6rem";
        else if (len <= 16) screen.style.fontSize = "1.3rem";
        else screen.style.fontSize = "1rem";
    };

    const handleButton = (value) => {
        if (errorState && value !== "AC") {
            screen.textContent = "";
            errorState = false;
        }

        if (value === "AC") {
            screen.textContent = "";
            errorState = false;
        } else if (value === "BACK") {
            if (!errorState) screen.textContent = screen.textContent.slice(0, -1);
        } else if (value === "±") {
            if (screen.textContent.length > 0 && !errorState) {
                screen.textContent = screen.textContent.startsWith("-") ?
                    screen.textContent.slice(1) : "-" + screen.textContent;
            }
        } else if (value === "=") {
            try {
                if (screen.textContent) {
                    screen.textContent = Function('"use strict";return (' + screen.textContent + ')')();
                }
            } catch {
                screen.textContent = "Error";
                errorState = true;
            }
        } else {
            screen.textContent += value;
        }

        adjustFont();
    };

    // Assign button listeners (click + touch)
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => handleButton(btn.dataset.value));
        btn.addEventListener("touchstart", () => handleButton(btn.dataset.value));
    });

    // Keyboard support
    document.addEventListener("keydown", e => {
        const key = e.key;
        const allowed = ["0","1","2","3","4","5","6","7","8","9","+","-","*","/","."];
        if (errorState && allowed.includes(key)) screen.textContent = errorState = false, screen.textContent = "";
        if (allowed.includes(key)) screen.textContent += key;
        else if (key === "Enter" || key === "=") handleButton("=");
        else if (key === "Backspace") handleButton("BACK");
        else if (key === "Escape" || key.toLowerCase() === "c") handleButton("AC");
        else if (key === "p" || key === "n") handleButton("±");
        adjustFont();
    });
});