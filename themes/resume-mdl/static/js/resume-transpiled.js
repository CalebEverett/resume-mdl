'use strict';

var moreHandler = function moreHandler(event) {
    var parentEl = event.currentTarget.parentElement;
    var listEls = parentEl.querySelectorAll('li');
    var moreIcon = event.currentTarget.querySelector('i');
    var time = 0;

    var _loop = function _loop(i) {
        setTimeout(function () {
            listEls[i].classList.toggle('resume-hidden');
        }, time);
        time += 15;
    };

    for (var i = listEls.length - 1; i >= 0; i--) {
        _loop(i);
    }

    if (moreIcon.innerHTML == 'expand_more') {
        moreIcon.innerHTML = 'expand_less';
    } else {
        moreIcon.innerHTML = 'expand_more';
    }
};

var moreAllHandler = function moreAllHandler(event) {
    var menuDelay = 300;
    var moreAllIcon = event.currentTarget.querySelector('i');
    var moreAllText = event.currentTarget.querySelector('span');
    var positions = document.querySelectorAll('.resume-position');

    var _loop2 = function _loop2(i) {
        var items = positions[i].querySelectorAll('li');
        var moreIcon = positions[i].querySelector('i');
        var time = 0;

        if (moreAllIcon.innerHTML == 'expand_more') {
            var _loop3 = function _loop3(j) {
                setTimeout(function () {
                    items[j].classList.remove('resume-hidden');
                }, time);
                time += 15;
            };

            for (var j = items.length - 1; j >= 0; j--) {
                _loop3(j);
            }
            if (moreIcon) moreIcon.innerHTML = 'expand_less';
        } else {
            var _loop4 = function _loop4(_j) {
                setTimeout(function () {
                    items[_j].classList.add('resume-hidden');
                }, time);
                time += 15;
            };

            for (var _j = items.length - 1; _j >= 0; _j--) {
                _loop4(_j);
            }
            if (moreIcon) moreIcon.innerHTML = 'expand_more';
        }
    };

    for (var i = positions.length - 1; i >= 0; i--) {
        _loop2(i);
    }

    setTimeout(function () {
        if (moreAllIcon.innerHTML == 'expand_less') {
            moreAllIcon.innerHTML = 'expand_more';
            moreAllText.innerHTML = 'Show Details';
        } else {
            moreAllIcon.innerHTML = 'expand_less';
            moreAllText.innerHTML = 'Hide Details';
        }
    }, menuDelay);
};
