

import ScrollReveal from 'scrollreveal';

const initializeScrollReveal = () => {
  ScrollReveal().reveal('.statistics-header', {
    duration: 1000,
    origin: 'top',
    distance: '50px',
    easing: 'ease-out',
    reset: false
  });

  ScrollReveal().reveal('.stat-card.primary', {
    duration: 1200,
    origin: 'bottom',
    distance: '50px',
    easing: 'ease-out',
    interval: 200,
    reset: false
  });

  ScrollReveal().reveal('.stat-card.secondary', {
    duration: 1200,
    origin: 'left',
    distance: '50px',
    easing: 'ease-out',
    interval: 200,
    reset: false
  });

  ScrollReveal().reveal('.comparative-section', {
    duration: 1500,
    origin: 'bottom',
    distance: '50px',
    easing: 'ease-out',
    reset: false
  });
};

<<<<<<< HEAD
export default initializeScrollReveal;
=======

export default initializeScrollReveal;
>>>>>>> cf6d65c27f3ff2eb03eaa3207fec06cd90ed5f1b
