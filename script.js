'use strict';


//////////////////////////////////////
// variable Declaration

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const navLinkBar = document.querySelector('.nav__links');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const operations__content = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnSlideLeft = document.querySelector('.slider__btn--left');
const btnSlideRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');



///////////////////////////////////////
// Modal window

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//////////////////////////////////////////////////
// button(learn more) Scroll 


btnScrollTo.addEventListener("click", function (e) {

  // old way, works everywhere

  // const s1Coord = section1.getBoundingClientRect();
  // console.log(s1Coord);
  // // window.scrollTo(s1Coord.left, s1Coord.top + window.pageYOffset);
  // window.scrollTo({
  //   left : s1Coord.left + window.pageXOffset,
  //   top : s1Coord.top + window.pageYOffset,
  //   behavior : "smooth",
  // });

  // modern way, may not work everywhere

  section1.scrollIntoView({behavior : "smooth"})
});

///////////////////////////////////////////////
// page navigation smooth scroll


navLinkBar.addEventListener('click', (e) => {
  e.preventDefault();
  const id = e.target.getAttribute('href');
  // matching strategy

  if (e.target.classList.contains("nav__link")){
    const element = document.querySelector(id); 
    element.scrollIntoView({behavior:'smooth'})
  }
});

////////////////////////////////////////////
// tabbed elements


tabsContainer.addEventListener('click', function (e) {
  const clickedElement = e.target.closest('.operations__tab');
  
  // guard clause
  if(!clickedElement) return;

  // set active tab
  tabs.forEach(el => el.classList.remove('operations__tab--active'))
  clickedElement.classList.add('operations__tab--active');

  // set active content area
  const selectedContainer =  document.querySelector(`.operations__content--${clickedElement.dataset.tab}`);
  operations__content.forEach(el => el.classList.remove('operations__content--active'))
  selectedContainer.classList.add('operations__content--active')
})

//////////////////////////////////////////////////
// nav fade animation 

const handleHover = function (e) {
  if(e.target.classList.contains('nav__link')) {
    const hoverElement = e.target;
    const siblings = hoverElement.closest('.nav').querySelectorAll('.nav__link');
    const logo = hoverElement.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if(el !== hoverElement) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

////////////////////////////////////////////////////
// sticky navigation

const stickyNav = function (entries) {
  const [entry] = entries;
  const sticky = !entry.isIntersecting;
  if(sticky) nav.classList.add('sticky');
  else nav.classList.remove('sticky')
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root : null,
  threshold : 0,
  rootMargin : `-${navHeight}px`
});

headerObserver.observe(header);


//////////////////////////////////////////////////////
// reveal sections on scroll

const allSections = document.querySelectorAll('.section');
const revealSections = function (entries,observer) {
  const [entry] =entries;
  if(!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const observeSections = new IntersectionObserver(revealSections,{
  root : null,
  threshold : 0.15,
});

allSections.forEach(function (section) {
  section.classList.add('section--hidden');
  observeSections.observe(section);
})

/////////////////////////////////////////////////////////
// lazy load images

const lazyImages = document.querySelectorAll('img[data-src]');

const revealImages = function (entries, observer) {
  const [entry] = entries;
  if(!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function() {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(revealImages, {
  root : null,
  threshold : 0,
  rootMargin : '200px',
});

lazyImages.forEach(image => {
  imgObserver.observe(image);
})

////////////////////////////////////////////////
// slider

const sliderInit = function() {

  let currSlide = 0;
  const maxSlides = slides.length;

  // functions
  const createDots = function () {
    slides.forEach((s,i) => {
      dotContainer.insertAdjacentHTML('beforeend', `
      <button class="dots__dot" data-slides=${i}></button>`)
    })
  };

  const setActiveDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach((d) => {
      d.classList.remove('dots__dot--active');
      d.dataset.slides == slide && d.classList.add('dots__dot--active');
    })
  }

  const moveToSlide = function (slideno) {
    slides.forEach((e,i) => {
      e.style.transform = `translateX(${100 * (i-slideno)}%)`;
    })
  };

  const nextSlide = function () {
    if(currSlide === (maxSlides - 1)) currSlide = 0;
    else currSlide++;
    moveToSlide(currSlide);
    setActiveDot(currSlide);
  };

  const prevSlide = function () {
    if(currSlide === 0) currSlide = (maxSlides - 1);
    else currSlide--;
    moveToSlide(currSlide);
    setActiveDot(currSlide);
  };

  // set default slide position and create dot buttons
  moveToSlide(0);
  createDots();
  setActiveDot(currSlide);

  // btn Right
  btnSlideRight.addEventListener('click',nextSlide)
  // btn Left
  btnSlideLeft.addEventListener('click',prevSlide)
  // arrow keys slide
  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowLeft' && prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  })
  // dots click slide
  dotContainer.addEventListener('click', function (e) {
    // guard clause
    if (!e.target.classList.contains('dots__dot')) return;

    const slide = e.target.dataset.slides;
    moveToSlide(slide);
    setActiveDot(slide);
    currSlide = Number.parseInt(slide);
  })
};
sliderInit();