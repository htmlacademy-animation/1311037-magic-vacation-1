export default class TextAnimation {
  constructor(delay, duration) {
    this.delay = delay;
    this.duration = duration || this.delay * 3;
  }
  init(node) {
    node.classList.add(`animated-text`);
  }

  splitByChar(node, globalDelay) {
    if (node.classList.contains(`animated-text_init`)) {
      return;
    }
    node.innerHTML = Array.from(node.textContent).map((char) => `<span>${char}</span>`).join(``);
    node.classList.add(`animated-text_init`);
    const wrappedNode = document.createElement(`div`);
    let lineCount = 0;
    node.querySelectorAll(`span`).forEach((span) => {
      let line = wrappedNode.querySelector(`span[data-offset="${span.offsetTop}"]`);
      if (!line) {
        line = document.createElement(`span`);
        line.dataset.offset = span.offsetTop;
        line.classList.add(`animated-text__line`);
        wrappedNode.appendChild(line);
        lineCount++;
      }
      span.classList.add(`animated-text__char`);
      span.style.animationDelay = `${2 * Math.random() * this.delay + this.duration * (lineCount - 1) + globalDelay}ms`;
      span.style.animationDuration = `${this.duration}ms`;
      line.appendChild(span.cloneNode(true));
    });
    wrappedNode.querySelectorAll(`span`).forEach((span) => {
      delete span.dataset.offset;
    });
    node.innerHTML = wrappedNode.innerHTML;
  }

}
