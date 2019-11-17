(function() {
  // detect window scroll

  function scrollCb (entries) {
    var el = document.querySelector('.sticky-page-nav');
    var isIntersecting = entries.some(function(item) {
      return item.isIntersecting;
    });

    // IE11 does not support classList.toggle 2nd arg
    if (isIntersecting) {
      el.classList.remove('elevated');
    } else {
      el.classList.add('elevated');
    }
  }

  var observer = new IntersectionObserver(scrollCb, {
    root: null,
    rootMargin: '0px',
    threshold: 1
  });


  function onDomLoaded () {
    var spy = new Gumshoe('.section-menu a', { activeNavTag: false });

    observer.observe(document.querySelector('.sticky-page-nav--shim'));
  }

  // async script loading can miss the dom loaded event
  if (document.readyState === 'interactive') {
    onDomLoaded();
  } else {
    window.addEventListener('DOMContentLoaded', onDomLoaded);
  }

})();
