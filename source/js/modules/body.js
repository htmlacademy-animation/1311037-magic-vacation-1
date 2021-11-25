export default () => {
  window.addEventListener(`load`, () => {
    document.querySelector(`.js-body`).classList.add(`body_loaded`);
  });
};
