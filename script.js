// ================================
// SUPABASE
// ================================

const SUPABASE_URL = "COLOCA_AQUI_O_PROJECT_URL";
const SUPABASE_KEY = "COLOCA_AQUI_A_ANON_KEY";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ================================
// ELEMENTOS
// ================================

const modal = document.getElementById("modal");

const openForm =
    document.getElementById("openForm");

const closeForm =
    document.getElementById("closeForm");

const form =
    document.getElementById("participantForm");

const nameInput =
    document.getElementById("name");

const participantsElement =
    document.getElementById("participants");

const countElement =
    document.getElementById("count");

const errorElement =
    document.getElementById("error");

const emojiButtons =
    document.querySelectorAll(".emoji");


// ================================
// EMOJI
// ================================

let selectedEmoji = "🗿";

emojiButtons.forEach(button => {

    button.addEventListener("click", () => {

        emojiButtons.forEach(btn =>
            btn.classList.remove("selected")
        );

        button.classList.add("selected");

        selectedEmoji = button.textContent.trim();
    });

});


// ================================
// MODAL
// ================================

openForm.addEventListener("click", () => {

    modal.classList.remove("hidden");

    setTimeout(() => {
        nameInput.focus();
    }, 100);

});


closeForm.addEventListener("click", () => {

    modal.classList.add("hidden");

});


modal.addEventListener("click", event => {

    if (event.target === modal) {
        modal.classList.add("hidden");
    }

});


// ================================
// CARREGAR PARTICIPANTES
// ================================

async function loadParticipants() {

    const {
        data,
        error
    } = await supabaseClient
        .from("participants")
        .select("id, name, emoji, status")
        .eq("status", "going")
        .order("created_at", {
            ascending: true
        });


    if (error) {

        console.error(error);

        participantsElement.innerHTML = `
            <div class="loading">
                Não foi possível carregar a lista.
            </div>
        `;

        return;
    }


    countElement.textContent = data.length;

    participantsElement.innerHTML = "";


    if (data.length === 0) {

        participantsElement.innerHTML = `
            <div class="loading">
                Ainda ninguém teve coragem...
            </div>
        `;

        return;
    }


    data.forEach(participant => {

        const element =
            document.createElement("div");

        element.className = "participant";

        element.innerHTML = `
            <div class="participant-emoji">
                ${escapeHtml(participant.emoji)}
            </div>

            <div class="participant-name">
                ${escapeHtml(participant.name)}
            </div>
        `;

        participantsElement.appendChild(element);

    });

}


// ================================
// ADICIONAR PARTICIPANTE
// ================================

form.addEventListener("submit", async event => {

    event.preventDefault();

    errorElement.textContent = "";

    const name =
        nameInput.value.trim();


    if (!name) {
        return;
    }


    const submitButton =
        form.querySelector(".submit-button");

    submitButton.disabled = true;

    submitButton.textContent =
        "A ENTRAR...";


    const {
        error
    } = await supabaseClient
        .from("participants")
        .insert({
            name: name,
            emoji: selectedEmoji,
            status: "going"
        });


    if (error) {

        console.error(error);

        errorElement.textContent =
            "Algo correu mal. Tenta novamente.";

        submitButton.disabled = false;

        submitButton.textContent =
            "ENTRAR NA LISTA";

        return;
    }


    // Limpar formulário

    nameInput.value = "";

    modal.classList.add("hidden");

    submitButton.disabled = false;

    submitButton.textContent =
        "ENTRAR NA LISTA";


    // Atualizar lista

    await loadParticipants();


    // Confetti

    showConfetti();

});


// ================================
// SEGURANÇA BÁSICA
// ================================

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


// ================================
// CONFETTI
// ================================

function showConfetti() {

    const container =
        document.getElementById("confetti");


    const emojis = [
        "🌊",
        "🏄",
        "🗿",
        "🦀",
        "🔥",
        "🌴"
    ];


    for (let i = 0; i < 25; i++) {

        const element =
            document.createElement("div");

        element.textContent =
            emojis[
                Math.floor(
                    Math.random() * emojis.length
                )
            ];


        element.style.position = "fixed";

        element.style.left =
            Math.random() * 100 + "%";

        element.style.top = "-50px";

        element.style.fontSize =
            (20 + Math.random() * 25) + "px";

        element.style.zIndex = "999";

        element.style.pointerEvents = "none";


        element.animate(
            [
                {
                    transform:
                        "translateY(0) rotate(0deg)",
                    opacity: 1
                },

                {
                    transform:
                        `translateY(${window.innerHeight + 100}px)
                         rotate(${Math.random() * 720 - 360}deg)`,
                    opacity: 0
                }
            ],
            {
                duration:
                    1500 + Math.random() * 1500,

                easing: "ease-in"
            }
        );


        container.appendChild(element);


        setTimeout(() => {
            element.remove();
        }, 3200);

    }

}


// ================================
// INICIALIZAÇÃO
// ================================

loadParticipants();
