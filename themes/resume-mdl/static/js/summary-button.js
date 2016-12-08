var mq = window.matchMedia("(min-width: 700px)")
mq.addListener(widthChange)
widthChange(mq)

function widthChange (mq) {
var postLinks = document.getElementsByClassName("resume-post-summary__text-link")
    if (mq.matches) {
        var newClass = [
        "resume-post-summary__text-link",
        "mdl-color-text--accent",
        "mdl-button",
        "mdl-button--icon",
        "mdl-js-button",
        "mdl-js-ripple-effect"
        ]
    } else {
        var newClass = [
        "resume-post-summary__text-link",
        "mdl-color-text--accent-contrast",
        "mdl-button",
        "mdl-button--colored",
        "mdl-button--fab",
        "mdl-button--mini-fab",
        "mdl-js-button",
        "mdl-js-ripple-effect",
        "mdl-shadow-2dp"
        ]
    }
    for (i = postLinks.length - 1; i > -1; i--) {
    postLinks[i].className = newClass.join(" ")
    }
}

