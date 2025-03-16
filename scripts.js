document.addEventListener("DOMContentLoaded", function () {
    let rock = {
        name: "",
        age: 0,
        happiness: 5,
        hunger: 5,
        dirtiness: 0,
        color: "#888888",
        hat: "none",
    };

    // ✅ Helper function to prevent negative or over-the-limit values
    const clampStat = (value) => Math.max(0, Math.min(10, value));

    // Load saved rock data from localStorage
    const loadRockData = () => {
        const savedData = localStorage.getItem("petRock");
        if (savedData) {
            rock = JSON.parse(savedData);
            showScreen("main-content");
            document.getElementById("rock-name").textContent = rock.name;
            updateStats();
            drawRock();
        }
    };

    // Save rock data to localStorage
    const saveRockData = () => {
        localStorage.setItem("petRock", JSON.stringify(rock));
    };

    // Helper function to show a specific screen
    const showScreen = (id) => {
        document.querySelectorAll(".screen").forEach(screen => screen.style.display = "none");
        document.getElementById(id).style.display = "flex";
    };

    // Start button - Show game choice screen
    document.getElementById("start-btn").addEventListener("click", () => showScreen("game-choice-screen"));

    // New Game button - Show name selection screen
    document.getElementById("new-game-btn").addEventListener("click", () => {
        localStorage.removeItem("petRock"); // Clear saved data
        showScreen("name-screen");
    });

    // Continue Game button - Load saved data
    document.getElementById("continue-game-btn").addEventListener("click", loadRockData);

    // Confirm name and move to cosmetic screen
    document.querySelector(".confirm-btn").addEventListener("click", () => {
        const nameInput = document.getElementById("rock-name-input").value.trim();
        if (nameInput !== "") {
            rock.name = nameInput;
            showScreen("cosmetic-screen");
        }
    });

    // 🎲 Random Name Generator
    const rockNames = [
    "Rocky", "Pebbles", "Boulder", "Stonezilla", "Quartz", 
    "Rockefeller", "Slate", "Obsidian", "Granite", "Shale"
];

document.getElementById("random-name-btn").addEventListener("click", () => {
    const randomName = rockNames[Math.floor(Math.random() * rockNames.length)];
    document.getElementById("rock-name-input").value = randomName;
});

    // Cosmetic selection
    const cosmeticItems = document.querySelectorAll(".cosmetic-item");
    cosmeticItems.forEach(item => {
        item.addEventListener("click", () => {
            cosmeticItems.forEach(i => i.classList.remove("selected"));
            item.classList.add("selected");
            rock.hat = item.getAttribute("data-hat");
        });
    });

    // Confirm cosmetics and move to loading screen
    document.getElementById("confirm-cosmetics-btn").addEventListener("click", () => {
        rock.color = document.getElementById("rock-color-picker").value;
        showScreen("loading-screen");

        // Simulate loading screen for 3 seconds before game starts
        setTimeout(() => {
            showScreen("main-content");
            document.getElementById("rock-name").textContent = rock.name;
            updateStats();
            drawRock(); // This was causing the bug before!
            saveRockData();
        }, 3000);
    });

    // Update Rock Status
    const updateStats = () => {
        rock.happiness = clampStat(rock.happiness);
        rock.hunger = clampStat(rock.hunger);
        rock.dirtiness = clampStat(rock.dirtiness);

        document.getElementById("rock-age").textContent = rock.age;
        document.getElementById("rock-happiness").textContent = rock.happiness;
        document.getElementById("rock-hunger").textContent = rock.hunger;
        document.getElementById("rock-dirtiness").textContent = rock.dirtiness;

        saveRockData();
    };

    // Actions: Feed, Clean, Play
document.getElementById("feed-btn").addEventListener("click", () => {
    if (rock.hunger > 0) {
        rock.hunger -= 2;
        rock.happiness += 1;
    }

    // Prevent over/under values
    rock.happiness = Math.max(0, Math.min(10, rock.happiness));
    rock.hunger = Math.max(0, Math.min(10, rock.hunger));
    rock.dirtiness = Math.max(0, Math.min(10, rock.dirtiness));

    updateStats();
});

document.getElementById("clean-btn").addEventListener("click", () => {
    if (rock.dirtiness > 0) {
        rock.dirtiness -= 2;
        rock.happiness += 1;
    }

    // Prevent over/under values
    rock.happiness = Math.max(0, Math.min(10, rock.happiness));
    rock.hunger = Math.max(0, Math.min(10, rock.hunger));
    rock.dirtiness = Math.max(0, Math.min(10, rock.dirtiness));

    updateStats();
});

document.getElementById("play-btn").addEventListener("click", () => {
    if (rock.happiness < 10) {
        rock.happiness += 2;
        rock.hunger += 1;
        rock.dirtiness += 1;
    }

    // Prevent over/under values
    rock.happiness = Math.max(0, Math.min(10, rock.happiness));
    rock.hunger = Math.max(0, Math.min(10, rock.hunger));
    rock.dirtiness = Math.max(0, Math.min(10, rock.dirtiness));

    updateStats();
});


    // Simulate a Day Passing
    document.getElementById("simulate-btn").addEventListener("click", () => {
        rock.age += 1;
        rock.hunger += 1;
        rock.dirtiness += 1;
        if (rock.happiness > 0) rock.happiness -= 1;

        if (rock.hunger >= 10) rock.happiness -= 2;
        if (rock.dirtiness >= 10) rock.happiness -= 2;

        if (rock.happiness <= 0) {
            alert(`${rock.name} is feeling a bit neglected. Let's give them some love!`);
        }

        updateStats();
    });

    // Show Status Button
    document.getElementById("status-btn").addEventListener("click", () => {
        alert(`Name: ${rock.name}\nAge: ${rock.age} days\nHappiness: ${rock.happiness}/10\nHunger: ${rock.hunger}/10\nDirtiness: ${rock.dirtiness}/10`);
    });

    // Draw the Rock on Canvas
    const drawRock = () => {
    const canvas = document.getElementById('rock-canvas');
    const ctx = canvas.getContext('2d');

    // Function to draw an irregular rock shape
    function drawRock(color = '#8B4513', x = 50, y = 50) {
        ctx.fillStyle = color;
    
        ctx.beginPath();
    
        // A smoother, rounded rock shape with curves
        ctx.moveTo(x, y + 40);
        ctx.quadraticCurveTo(x + 60, y - 30, x + 120, y + 40); // Top curve
        ctx.quadraticCurveTo(x + 140, y + 80, x + 100, y + 120); // Right curve
        ctx.quadraticCurveTo(x + 40, y + 160, x - 20, y + 100); // Bottom curve
        ctx.quadraticCurveTo(x - 40, y + 40, x, y + 40); // Left curve
        ctx.closePath();
    
        ctx.fill();
    
        // Draw simple face
        ctx.beginPath();
        ctx.arc(x + 40, y + 70, 5, 0, Math.PI * 2); // Left eye
        ctx.arc(x + 80, y + 70, 5, 0, Math.PI * 2); // Right eye
        ctx.fillStyle = 'black';
        ctx.fill();
    
        // Smile
        ctx.beginPath();
        ctx.arc(x + 60, y + 90, 20, 0, Math.PI);
        ctx.stroke();
    }

    // Initial rock draw
    drawRock();

        // Add hat if selected
        if (rock.hat === "top-hat") {
            ctx.fillStyle = "black";
            ctx.fillRect(60, 10, 80, 40); // Hat top
            ctx.fillRect(40, 50, 120, 15); // Hat brim
        } else if (rock.hat === "cowboy-hat") {
            ctx.fillStyle = "brown";
            // 🟠 Brim (wavy and curved)
            ctx.beginPath();
            ctx.ellipse(100, 70, 100, 25, 0, 0, Math.PI * 2); 
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(60, 40);
            ctx.quadraticCurveTo(100, -10, 140, 40); // Top curve
            ctx.quadraticCurveTo(100, 10, 60, 40); // Bottom curve
            ctx.fill();
        } else if (rock.hat === "party-hat") {
            ctx.fillStyle = "purple";
            ctx.beginPath();
            ctx.moveTo(100, 10);
            ctx.lineTo(60, 60);
            ctx.lineTo(140, 60);
            ctx.closePath();
            ctx.fill(); // Triangle party hat
        } else if (rock.hat === "crown") {
            ctx.fillStyle = "gold";
            ctx.beginPath();
            ctx.moveTo(60, 30);
            ctx.lineTo(80, 60);
            ctx.lineTo(100, 30);
            ctx.lineTo(120, 60);
            ctx.lineTo(140, 30);
            ctx.lineTo(140, 80);
            ctx.lineTo(60, 80);
            ctx.closePath();
            ctx.fill();
        } else if (rock.hat === "beret") {
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(100, 70, 50, Math.PI, 0);
            ctx.fill();
        }
    };

    // 🪨 Motivational Messages
const motivationalMessages = [
    "You rock, just like your pet rock!",
    "Keep going, you're doing great!",
    "Success is built one pebble at a time.",
    "Believe in yourself and your pet rock will believe in you!",
    "Stay strong, stay steady, just like your rock!"
];

// 🗨️ Speech bubble element
const speechBubble = document.getElementById("speech-bubble");

// Handle rock click
document.getElementById("rock-canvas").addEventListener("click", (event) => {
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

    // Show speech bubble
    speechBubble.textContent = randomMessage;
    speechBubble.style.left = `${event.clientX}px`;
    speechBubble.style.top = `${event.clientY}px`;
    speechBubble.classList.remove("hidden");

    // Hide after 3 seconds
    setTimeout(() => {
        speechBubble.classList.add("hidden");
    }, 3000);
});

    // 🌟🌟 CRAZY STAR GENERATION 🌟🌟
    const starContainer = document.querySelector('.stars-container');

    // Generate **500** stars instantly
    for (let i = 0; i < 500; i++) {
        const star = document.createElement("div");
        star.className = "star";
        star.style.left = Math.random() * window.innerWidth + "px";
        star.style.top = Math.random() * window.innerHeight + "px";
        star.style.animationDuration = `${Math.random() * 3 + 2}s`;
        star.style.opacity = Math.random();
        star.style.width = `${Math.random() * 3 + 1}px`;
        star.style.height = star.style.width;
        starContainer.appendChild(star);
    }

    // Add **10 new stars every 20ms**
    const createStar = () => {
        const star = document.createElement("div");
        star.classList.add("star");
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        star.style.animationDuration = `${Math.random() * 2 + 1}s`;
        star.style.opacity = Math.random();
        star.style.width = `${Math.random() * 4}px`;
        star.style.height = star.style.width;

        starContainer.appendChild(star);

        setTimeout(() => {
            star.remove();
        }, 4000);
    };

    setInterval(() => {
        for (let i = 0; i < 10; i++) {
            createStar();
        }
    }, 20);

    function startDodging() {
        const buttons = document.querySelectorAll('.actions button');
        const dodgeRadius = 100; // How close the mouse needs to be for buttons to dodge
    
        const dodge = (e) => {
            buttons.forEach(button => {
                const rect = button.getBoundingClientRect();
                const distanceX = e.clientX - (rect.left + rect.width / 2);
                const distanceY = e.clientY - (rect.top + rect.height / 2);
                const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    
                if (distance < dodgeRadius) {
                    const angle = Math.atan2(distanceY, distanceX);
                    const moveX = Math.cos(angle) * dodgeRadius;
                    const moveY = Math.sin(angle) * dodgeRadius;
    
                    button.style.transition = 'transform 0.1s ease-out';
                    button.style.transform = `translate(${moveX}px, ${moveY}px)`;
                } else {
                    button.style.transform = '';
                }
            });
        };
    
        // Start dodging when the mouse moves
        document.addEventListener('mousemove', dodge);
    
        // Stop dodging after 5 seconds
        setTimeout(() => {
            document.removeEventListener('mousemove', dodge);
            buttons.forEach(button => {
                button.style.transform = ''; // Reset button position
            });
        }, 5000);
    }
    
    startDodging(); // Run the function    
    
    // Start the dodging effect when the main game screen is shown
    document.addEventListener("DOMContentLoaded", () => {
        document.getElementById("confirm-cosmetics-btn").addEventListener("click", startDodging);
    });    
});
