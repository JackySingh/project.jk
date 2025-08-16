window.onload = () => {
    const van = document.getElementById("van");
    const human = document.getElementById("human");
    const form = document.getElementById("loginForm");
    const submitBtn = document.getElementById("submitBtn");
    const backBtn = document.getElementById("backBtn");

    let vanPos = -250;
    const stopPoint = window.innerWidth / 2 - 150;
    const humanPos = stopPoint + 180;

    form.style.display = "none";
    human.style.display = "none";

    // --- Van enters ---
    const vanMove = setInterval(() => {
        vanPos += 10;
        van.style.left = vanPos + "px";

        if (vanPos >= stopPoint) {
            clearInterval(vanMove);
            humanExitAnimation();
        }
    }, 20);

    // --- Human exit animation ---
    function humanExitAnimation() {
        let hLeft = vanPos + 50;
        human.style.left = hLeft + "px";
        human.style.display = "block";

        const humanExit = setInterval(() => {
            hLeft += 5;
            human.style.left = hLeft + "px";

            if (hLeft >= humanPos) {
                clearInterval(humanExit);
                setTimeout(() => form.style.display = "flex", 300);
            }
        }, 20);
    }

    // --- Human enter animation ---
    function humanEnterAnimation(callback) {
        let hLeft = parseInt(human.style.left);

        const humanEnter = setInterval(() => {
            hLeft -= 5;
            human.style.left = hLeft + "px";

            if (hLeft <= vanPos + 50) {
                clearInterval(humanEnter);
                human.style.display = "none";
                if (callback) callback();
            }
        }, 20);
    }

    // --- Van leaves ---
    function vanLeaveAnimation() {
        let leavePos = vanPos;
        const vanLeave = setInterval(() => {
            leavePos += 15;
            van.style.left = leavePos + "px";
            if (leavePos > window.innerWidth) {
                clearInterval(vanLeave);
            }
        }, 20);
    }

    // --- Back Button ---
    backBtn.onclick = () => {
        form.style.display = "none";
        human.style.display = "none";
        van.style.left = "-250px";
        vanPos = -250;

        const restart = setInterval(() => {
            vanPos += 10;
            van.style.left = vanPos + "px";
            if (vanPos >= stopPoint) {
                clearInterval(restart);
                humanExitAnimation();
            }
        }, 20);
    };

    // --- Submit Button ---
    submitBtn.onclick = (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const fatherName = document.getElementById("fatherName").value.trim();
        const mobile = document.getElementById("mobile").value.trim();

        if (!name || !fatherName || !mobile) {
            alert("⚠️ Please fill all fields");
            return;
        }

        fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, fatherName, mobile })
        })
        .then(res => res.json())
        .then(data => {
            console.log("✅ API Response:", data);

            form.style.display = "none";
            humanEnterAnimation(vanLeaveAnimation);
        })
        .catch(err => console.error("❌ API Error:", err));
    };
};
