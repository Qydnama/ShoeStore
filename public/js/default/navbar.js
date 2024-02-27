
window.addEventListener("load", function() {
    document.body.classList.add("loaded");
});

document.addEventListener("DOMContentLoaded", function() {
    var lastScrollTop = 0;
    var header = document.querySelector("header");

    window.addEventListener("scroll", function() {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            header.classList.add("hide");
        } else {
            header.classList.remove("hide");
        }
        lastScrollTop = scrollTop;
    });

    header.addEventListener("mouseenter", function() {
        header.classList.remove("hide");
    });
});