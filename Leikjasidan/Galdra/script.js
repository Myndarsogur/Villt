// script.js

// Stjörnur sem ferðast yfir skjáinn
const starsContainer = document.querySelector('.stars');
const centerText = document.querySelector('.center-text');
const symbols = document.querySelectorAll('.symbol');

function createStar() {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = `${Math.random() * 100}vw`;
    star.style.top = `${Math.random() * 100}vh`;
    star.style.animationDuration = `${Math.random() * 2 + 1}s`;
    star.style.opacity = Math.random();
    starsContainer.appendChild(star);

    setTimeout(() => star.remove(), 3000);
}

setInterval(createStar, 100);

const styles = document.createElement('style');
styles.innerHTML = `
.star {
    position: absolute;
    width: 3px;
    height: 3px;
    background: white;
    border-radius: 50%;
    animation: star-move linear forwards;
}
`;
document.head.appendChild(styles);

// Smelltu á stjörnumerki til að birta texta í miðjunni og færa það
symbols.forEach(symbol => {
    symbol.addEventListener('click', () => {
        const text = symbol.getAttribute('data-text');
        centerText.textContent = text;

        // Færa textann þannig að það forðast stjörnumerkin
        const angle = parseFloat(symbol.style.getPropertyValue('--angle'));
        const offsetX = 150 * Math.cos((angle - 90) * Math.PI / 180); // Færsla miðað við snúning
        const offsetY = 150 * Math.sin((angle - 90) * Math.PI / 180);

        centerText.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
});