const moreHandler = (event) => {
    const parentEl = event.currentTarget.parentElement.parentElement
    const listEls = parentEl.querySelectorAll('li')
    let moreIcon = event.currentTarget.querySelector('i')
    let time = 0

    for (let i = listEls.length -1; i>=0; i--) {
        setTimeout(() => {
            listEls[i].classList.toggle('resume-hidden')
        }, time)
        time += 15
    }

    if (moreIcon.innerHTML == 'expand_more') {
        moreIcon.innerHTML = 'expand_less'
    } else {
        moreIcon.innerHTML = 'expand_more'
    }
}

const moreAllHandler = (event) => {
    const menuDelay = 300;
    const moreAllIcon = event.currentTarget.querySelector('i')
    const moreAllText = event.currentTarget.querySelector('span')
    const positions = document.querySelectorAll('.resume-position')

    for (let i = positions.length -1; i>=0; i--) {
        let items = positions[i].querySelectorAll('li')
        let moreIcon = positions[i].querySelector('i')
        let time = 0

        if (moreAllIcon.innerHTML == 'expand_more') {
            for (let j = items.length -1; j>=0; j--) {
                setTimeout(() => {
                    items[j].classList.remove('resume-hidden')
                }, time)
                time += 15
            }
            if (moreIcon) moreIcon.innerHTML = 'expand_less'
        } else {
            for (let j = items.length -1; j>=0; j--) {
                setTimeout(() => {
                    items[j].classList.add('resume-hidden')
                }, time)
                time += 15
            }
            if (moreIcon) moreIcon.innerHTML = 'expand_more'
        }
    }

    if (moreAllIcon.innerHTML == 'expand_less') {
        moreAllIcon.innerHTML = 'expand_more'
    } else {
        moreAllIcon.innerHTML = 'expand_less'
    }
}

