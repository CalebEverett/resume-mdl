const toggleMore = (el) => {
    if (el.innerHTML == 'expand_more') {
        el.innerHTML = 'expand_less'
    } else {
        el.innerHTML = 'expand_more'
    }
}

const moreHandler = (event) => {
    const parentEl = event.currentTarget.parentElement
    const listEls = parentEl.getElementsByTagName('li')
    let moreIcon = event.currentTarget.getElementsByTagName('i')[0]
    let time = 0
    for (let i = listEls.length -1; i>=0; i--) {
        setTimeout(() => {
            listEls[i].classList.toggle('resume-hidden')
        }, time)
        time += 30
    }
    toggleMore(moreIcon)
}

const moreAllHandler = (event) => {
    const moreAllIcon = event.currentTarget.getElementsByTagName('i')[0]
    const moreAllTool = event.currentTarget.getElementsByTagName('span')[0]
    const positions = document.getElementsByClassName('resume-position')

    for (let i = positions.length -1; i>=0; i--) {
        let items = positions[i].getElementsByTagName('li')
        let moreIcon = positions[i].getElementsByTagName('i')[0]
        let time = 0

        if (moreAllIcon.innerHTML == 'expand_more') {
            console.log()
            for (let j = items.length -1; j>=0; j--) {
                setTimeout(() => {
                    items[j].classList.remove('resume-hidden')
                }, time)
                time += 30
            }
            if (moreIcon) moreIcon.innerHTML = 'expand_less'
        } else {
            for (let j = items.length -1; j>=0; j--) {
                setTimeout(() => {
                    items[j].classList.add('resume-hidden')
                }, time)
                time += 30
            }
            if (moreIcon) moreIcon.innerHTML = 'expand_more'
        }
    }
    toggleMore(moreAllIcon)
    if (moreAllIcon.innerHTML == 'expand_more') {
        moreAllTool.innerHTML = 'Show Details'
    } else {
        moreAllTool.innerHTML = 'Hide Details'
    }

}
