import Swiper from "swiper";

export default () => {
  let storySlider;
  const uiClassList = [`body_normal`, `body_light`, `body_blue`];
  const uiParams = [
    {
      idxs: [0, 1],
      gradient: `linear-gradient(180deg, rgba(83, 65, 118, 0) 0%, #523E75 16.85%)`,
      image: `url("img/slide1.jpg")`,
      uiClass: uiClassList[0]
    }, {
      idxs: [2, 3],
      gradient: `linear-gradient(180deg, rgba(45, 54, 179, 0) 0%, #2A34B0 16.85%)`,
      image: `url("img/slide2.jpg")`,
      uiClass: uiClassList[1]
    }, {
      idxs: [4, 5],
      gradient: `linear-gradient(180deg, rgba(92, 138, 198, 0) 0%, #5183C4 16.85%)`,
      image: `url("img/slide3.jpg")`,
      uiClass: uiClassList[2]
    }, {
      idxs: [6, 7],
      gradient: `linear-gradient(180deg, rgba(45, 39, 63, 0) 0%, #2F2A42 16.85%)`,
      image: `url("img/slide4.jpg")`,
      uiClass: uiClassList[0]
    }
  ];
  const slideChangeFunction = (withGradient) => {
    return () => {
      const uiObj = uiParams.find((obj) => obj.idxs.includes(storySlider.activeIndex));
      sliderContainer.style.backgroundImage = withGradient ? [uiObj.image, uiObj.gradient].join(`, `) : uiObj.image;
      document.body.classList.remove(...uiClassList);
      document.body.classList.add(uiObj.uiClass);
    };
  };
  let sliderContainer = document.getElementById(`story`);
  sliderContainer.style.backgroundImage = [uiParams[0].image, uiParams[1].gradient].join(`, `);
  document.body.classList.add(uiParams[0].uiClass);
  const setSlider = function () {
    if (((window.innerWidth / window.innerHeight) < 1) || window.innerWidth < 769) {
      storySlider = new Swiper(`.js-slider`, {
        pagination: {
          el: `.swiper-pagination`,
          type: `bullets`
        },
        keyboard: {
          enabled: true
        },
        on: {
          slideChange: slideChangeFunction(true),
          resize: () => {
            storySlider.update();
          }
        },
        observer: true,
        observeParents: true
      });
    } else {
      storySlider = new Swiper(`.js-slider`, {
        slidesPerView: 2,
        slidesPerGroup: 2,
        pagination: {
          el: `.swiper-pagination`,
          type: `fraction`
        },
        navigation: {
          nextEl: `.js-control-next`,
          prevEl: `.js-control-prev`,
        },
        keyboard: {
          enabled: true
        },
        on: {
          slideChange: slideChangeFunction(),
          resize: () => {
            storySlider.update();
          }
        },
        observer: true,
        observeParents: true
      });
    }
  };

  window.addEventListener(`resize`, function () {
    if (storySlider) {
      storySlider.destroy();
    }
    setSlider();
  });

  setSlider();
};
