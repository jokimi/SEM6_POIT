document.addEventListener("DOMContentLoaded", async () => {
    const photosDiv = document.getElementById("photos");
    const eventsDiv = document.getElementById("events");
    try {
        const res = await fetch("/api/Celebrities");
        const celebrities = await res.json();
        celebrities.forEach(c => {
            const img = document.createElement("img");
            img.src = `/api/Celebrities/photo/${encodeURIComponent(c.reqPhotoPath)}`;
            img.alt = c.fullName;
            img.title = c.fullName;
            img.loading = "lazy";
            img.addEventListener("click", async () => {
                const eventRes = await fetch(`/api/Lifeevents/Celebrities/${c.id}`);
                const events = await eventRes.json();
                eventsDiv.innerHTML = `<h3>События: ${c.fullName}</h3>`;
                if (events.length === 0) {
                    eventsDiv.innerHTML += "<p>Нет событий.</p>";
                }
                else {
                    const list = document.createElement("ul");
                    events.forEach(e => {
                        const li = document.createElement("li");
                        li.textContent = `${new Date(e.date).toLocaleDateString()} - ${e.description}`;
                        list.appendChild(li);
                    });
                    eventsDiv.appendChild(list);
                }
            });
            photosDiv.appendChild(img);
        });
    }
    catch (err) {
        console.error("Ошибка загрузки данных:", err);
        photosDiv.innerHTML = "<p>Ошибка загрузки знаменитостей.</p>";
    }
});