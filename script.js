let audio = null;

let xp = 0;
let candles = 3;
let gameScore = 0;


// ===============================
// LOADER
// ===============================

window.addEventListener("load", () => {

  setTimeout(() => {
    document
      .getElementById("loader")
      .classList.add("hide");
  }, 1800);

});


// ===============================
// SOUND
// ===============================

function clickSound(success = false) {

  if (!audio) {

    audio = new (
      window.AudioContext ||
      window.webkitAudioContext
    )();

  }

  const osc = audio.createOscillator();
  const gain = audio.createGain();

  osc.connect(gain);
  gain.connect(audio.destination);

  osc.frequency.value =
    success ? 720 : 360;

  gain.gain.setValueAtTime(
    .0001,
    audio.currentTime
  );

  gain.gain.exponentialRampToValueAtTime(
    .04,
    audio.currentTime + .01
  );

  gain.gain.exponentialRampToValueAtTime(
    .0001,
    audio.currentTime + .12
  );

  osc.start();

  osc.stop(
    audio.currentTime + .13
  );

}


// ===============================
// CURSOR
// ===============================

const cursor =
  document.querySelector(".cursor-light");

document.addEventListener("mousemove", e => {

  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";

});


// ===============================
// START
// ===============================

document
  .getElementById("startBtn")
  .addEventListener("click", () => {

    clickSound(true);

    document
      .querySelector(".section")
      .scrollIntoView({
        behavior: "smooth"
      });

  });


// ===============================
// XP
// ===============================

function addXP(amount) {

  xp += amount;

  if (xp > 100) {
    xp = 100;
  }

  document
    .getElementById("xpBar")
    .style.width = xp + "%";

  document
    .getElementById("xpText")
    .textContent =
    xp + " / 100";

  document
    .getElementById("miniXP")
    .textContent = xp;

  updateAchievements();

  if (xp >= 100) {
    levelUp();
  }

}


// ===============================
// MISSIONS
// ===============================

document
  .querySelectorAll(".mission-btn")
  .forEach(button => {

    button.addEventListener("click", () => {

      const mission =
        button.closest(".mission");

      if (mission.classList.contains("done")) {
        return;
      }

      mission.classList.add("done");

      button.textContent =
        "COMPLETED ✓";

      clickSound(true);

      addXP(20);

      confetti(25);

    });

  });


// ===============================
// CAKE
// ===============================

document
  .querySelectorAll(".cake-candles button")
  .forEach((button, index) => {

    button.addEventListener("click", () => {

      if (button.dataset.used) {
        return;
      }

      button.dataset.used = "true";

      const flame =
        document.querySelectorAll(".cake-flame")[index];

      flame.classList.add("off");

      candles--;

      clickSound(true);

      document
        .getElementById("cakeStatus")
        .textContent =
        candles === 0
          ? "WISH ACTIVATED ✨"
          : candles + " CANDLES REMAINING";

      addXP(10);

      if (candles === 0) {
        confetti(70);
        fireworks(5);
      }

    });

  });


// ===============================
// MINI GAME
// ===============================

document
  .querySelectorAll(".core")
  .forEach(core => {

    core.addEventListener("click", () => {

      if (core.classList.contains("collected")) {
        return;
      }

      core.classList.add("collected");

      gameScore += 10;

      document
        .getElementById("gameXP")
        .textContent = gameScore;

      clickSound(true);

      addXP(10);

      if (gameScore >= 60) {

        document
          .getElementById("gameComplete")
          .textContent =
          "MISSION COMPLETE 🏆";

        confetti(100);

      }

    });

  });


// ===============================
// PHOTO
// ===============================

document
  .querySelector(".photo")
  .addEventListener("click", function () {

    if (!this.classList.contains("revealed")) {

      this.classList.add("revealed");

      clickSound(true);

      addXP(10);

    }

  });


// ===============================
// ACHIEVEMENTS
// ===============================

function updateAchievements() {

  document
    .querySelectorAll(".achievement")
    .forEach(item => {

      const required =
        Number(item.dataset.level);

      if (
        xp >= required &&
        !item.classList.contains("unlocked")
      ) {

        item.classList.add("unlocked");

        clickSound(true);

      }

    });

}


// ===============================
// GIFTS
// ===============================

const modal =
  document.getElementById("modal");

document
  .querySelectorAll(".gift")
  .forEach(gift => {

    gift.addEventListener("click", () => {

      clickSound(true);

      document
        .getElementById("modalMessage")
        .textContent =
        gift.dataset.message;

      modal.classList.add("show");

      addXP(10);

      confetti(35);

    });

  });


// ===============================
// MODAL
// ===============================

document
  .getElementById("close")
  .addEventListener("click", () => {

    clickSound();

    modal.classList.remove("show");

  });


document
  .getElementById("modalCelebrate")
  .addEventListener("click", () => {

    modal.classList.remove("show");

    clickSound(true);

    confetti(100);

  });


modal.addEventListener("click", e => {

  if (e.target === modal) {
    modal.classList.remove("show");
  }

});


// ===============================
// FINAL CELEBRATION
// ===============================

document
  .getElementById("celebrate")
  .addEventListener("click", () => {

    clickSound(true);

    confetti(180);
    fireworks(10);

    addXP(20);

  });


// ===============================
// CONFETTI
// ===============================

function confetti(amount) {

  const symbols = [
    "◆",
    "✦",
    "★",
    "●"
  ];

  for (let i = 0; i < amount; i++) {

    const piece =
      document.createElement("div");

    piece.className = "confetti";

    piece.textContent =
      symbols[
      Math.floor(
        Math.random() *
        symbols.length
      )
      ];

    piece.style.left =
      Math.random() * 100 + "vw";

    piece.style.color =
      Math.random() > .5
        ? "#ffb703"
        : "#54e8ff";

    piece.style.fontSize =
      5 + Math.random() * 10 + "px";

    piece.style.animationDuration =
      2 + Math.random() * 2 + "s";

    document.body.appendChild(piece);

    setTimeout(() => {
      piece.remove();
    }, 4500);

  }

}


// ===============================
// FIREWORKS
// ===============================

function fireworks(count) {

  for (let i = 0; i < count; i++) {

    setTimeout(() => {

      const x =
        Math.random() *
        window.innerWidth;

      const y =
        Math.random() *
        window.innerHeight *
        .6;

      for (let j = 0; j < 20; j++) {

        const spark =
          document.createElement("i");

        spark.className =
          "firework";

        spark.style.left =
          x + "px";

        spark.style.top =
          y + "px";

        spark.style.setProperty(
          "--rx",
          Math.random()
        );

        spark.style.setProperty(
          "--ry",
          Math.random()
        );

        document.body.appendChild(spark);

        setTimeout(() => {
          spark.remove();
        }, 1000);

      }

    }, i * 150);

  }

}


// ===============================
// LEVEL UP
// ===============================

function levelUp() {

  confetti(100);
  fireworks(6);

  const card =
    document.querySelector(".player-card");

  card.animate(
    [
      {
        transform: "scale(1)"
      },
      {
        transform: "scale(1.04)"
      },
      {
        transform: "scale(1)"
      }
    ],
    {
      duration: 700,
      iterations: 2
    }
  );

}


// ===============================
// SCROLL REVEAL
// ===============================

const observer =
  new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target
            .classList
            .add("visible");

        }

      });

    },
    {
      threshold: .1
    }
  );

document
  .querySelectorAll(".reveal")
  .forEach(element =>
    observer.observe(element)
  );


// ===============================
// BUTTON SOUNDS
// ===============================

document
  .querySelectorAll("button")
  .forEach(button => {

    button.addEventListener(
      "pointerdown",
      () => clickSound()
    );

  });


// ===============================
// SECRET EASTER EGG
// TAP LOGO 5 TIMES
// ===============================

let logoClicks = 0;

document
  .querySelector(".brand")
  .addEventListener("click", () => {

    logoClicks++;

    if (logoClicks >= 5) {

      logoClicks = 0;

      clickSound(true);

      confetti(150);
      fireworks(7);

      alert(
        "🔓 SECRET MODE UNLOCKED!\n\n" +
        "Abdullah = LITTLE LEGEND 🏆\n\n" +
        "— Aaliyan"
      );

    }

  });