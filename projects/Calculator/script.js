// Number input to screen
document.addEventListener("DOMContentLoaded", () => {
    const buttonClasses = [
        "one", "two", "three", "four", "five",
        "six", "seven", "eight", "nine", "zero",
        "plus", "minus", "multiply", "divide"
    ];

    const screen = document.getElementsByClassName("screen")[0];

    buttonClasses.forEach((className) => {
        const element = document.getElementsByClassName(className)[0];
        if (!element) return;

        const span = element.querySelector("span");
        if (!span) return;

        span.addEventListener("click", () => {
            screen.classList.add("input");
            // let scr = screen.textContent += span.textContent;
            let length = (screen.textContent.length);

            if (length <= 15) {
                scr = screen.textContent += span.textContent;
            }


            const equal = document.getElementsByClassName("equal")[0];

            equal.addEventListener("click", () => {
                const screen = document.getElementsByClassName('screen')[0];
                screen.innerText = (eval(scr));





            })
        });
    });


});

document.addEventListener("keydown", (event) => {
    const screen = document.querySelector(".screen"); // use querySelector for simplicity
    const key = event.key;

    const allowedKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-", "*", "/"];

    if (allowedKeys.includes(key)) {
        if (screen.textContent.length < 15) { 
            screen.textContent += key;
        }
    }

    else if (key === "Enter" || key === "=") {
        try {
            const result = eval(screen.textContent); 
            screen.textContent = result;
        } catch {
            screen.textContent = "Error";
        }
    }

    else if (key === "Backspace") {
        screen.textContent = screen.textContent.slice(0, -1);
    }

    else if (key === "Escape" || key.toLowerCase() === "c") {
        screen.textContent = "";
    }
    else if (key.toLowerCase() === "p" || key.toLowerCase() === "n") {
        if (screen.textContent.startsWith("-")) {
            screen.textContent = screen.textContent.slice(1);
        } else {
            screen.textContent = "-" + screen.textContent;
        }
    }
});




// reset
const onBtn = document.querySelector('.on');
onBtn.addEventListener('click', () => {
    const screen = document.getElementsByClassName('screen')[0];
    screen.innerText = '';
});