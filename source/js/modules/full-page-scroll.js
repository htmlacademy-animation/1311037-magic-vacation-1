import throttle from 'lodash/throttle';
import TextAnimation from "./common/text-animation";

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 1000;
    this.scrollFlag = true;
    this.timeout = null;

    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = Array.from(document.querySelectorAll(`.page-header__menu .js-menu-link`));
    this.textAnimation = new TextAnimation(150);
    this.activeScreen = 0;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
    this.animationNodes = [
      `.intro__title, .intro__label, .intro__date`,
      `.slider__item-title`,
      `.prizes__title,  .prizes__desc b`,
      `.rules__title`,
      `.game__title`
    ];
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: true}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);
    this.screenElements.forEach((screen, idx) => {
      screen.querySelectorAll(this.animationNodes[idx]).forEach((node) => {
        this.textAnimation.init(node);
      });
    });
    this.onUrlHashChanged();
  }

  onScroll(evt) {
    if (this.scrollFlag) {
      this.reCalculateActiveScreenPosition(evt.deltaY);
      const currentPosition = this.activeScreen;
      if (currentPosition !== this.activeScreen) {
        this.changePageDisplay();
      }
    }
    this.scrollFlag = false;
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.timeout = null;
      this.scrollFlag = true;
    }, this.THROTTLE_TIMEOUT);
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    this.changePageDisplay();
  }

  changePageDisplay() {
    this.changeVisibilityDisplay();
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();
  }

  changeVisibilityDisplay() {
    const currentActiveScreen = Array.from(this.screenElements).find((screen) => screen.classList.contains(`active`));

    const toggleScreen = () => {
      this.screenElements.forEach((screen) => {
        screen.classList.add(`screen--hidden`);
        screen.classList.remove(`active`);
      });
      const activeScreenNode = this.screenElements[this.activeScreen];
      activeScreenNode.classList.remove(`screen--hidden`);
      setTimeout(() => {
        activeScreenNode.classList.add(`active`);
        activeScreenNode.querySelectorAll(this.animationNodes[this.activeScreen]).forEach((node, idx) => {
          this.textAnimation.splitByChar(node, 300 * idx);
        });
      }, 100);
    };
    if (Array.from(this.screenElements).indexOf(currentActiveScreen) === 1) {
      currentActiveScreen.classList.add(`screen_unloaded`);
      setTimeout(() => {
        currentActiveScreen.classList.remove(`screen_unloaded`);
        toggleScreen();
      }, 250);
    } else {
      toggleScreen();
    }
  }

  changeActiveMenuItem() {
    const activeItem = this.menuElements.find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    const oldActiveItem = this.menuElements.find((element) => element.classList.contains(`active`));
    if (activeItem) {
      oldActiveItem.classList.remove(`active`);
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreen = Math.min(this.screenElements.length - 1, ++this.activeScreen);
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }
}
