function prevNextHandler(event) {
	event.preventDefault()
	var newActive = event.currentTarget.getAttribute("href")
	var activeEls = document.querySelectorAll(".is-active")
	var newActiveTab = document.querySelector("a[href='" + newActive + "']")
	var newActiveSection = document.querySelector("section[id=" + newActive.slice(1) + "]")
	for (var i=0;i<activeEls.length;i++) {
		 activeEls[i].classList.remove("is-active")
	}
	newActiveTab.classList.add("is-active")
	newActiveSection.classList.add("is-active")
}
