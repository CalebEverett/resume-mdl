'use strict';

var toggleMore = function toggleMore(el) {
    if (el.innerHTML == 'expand_more') {
        el.innerHTML = 'expand_less';
    } else {
        el.innerHTML = 'expand_more';
    }
};

var moreHandler = function moreHandler(event) {
    var parentEl = event.currentTarget.parentElement;
    var listEls = parentEl.getElementsByTagName('li');
    var moreIcon = event.currentTarget.getElementsByTagName('i')[0];
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
    toggleMore(moreIcon);
};

var moreAllHandler = function moreAllHandler(event) {
    var moreAllIcon = event.currentTarget.getElementsByTagName('i')[0];
    var moreAllTool = event.currentTarget.getElementsByTagName('span')[0];
    var positions = document.getElementsByClassName('resume-position');

    var _loop2 = function _loop2(i) {
        var items = positions[i].getElementsByTagName('li');
        var moreIcon = positions[i].getElementsByTagName('i')[0];
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
    toggleMore(moreAllIcon);
    if (moreAllIcon.innerHTML == 'expand_more') {
        moreAllTool.innerHTML = 'Show Details';
    } else {
        moreAllTool.innerHTML = 'Hide Details';
    }
};
