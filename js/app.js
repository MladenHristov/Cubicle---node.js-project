document.querySelector(".cube-list").addEventListener("click", (evt) => {
  const target = evt.target;

  if (target.classList.contains("more")) {
    //
    const desc = target.parentNode.querySelector(".cube-description");

    console.log(target.textContent == "See more");

    if (target.textContent == "See more") {
      desc.style.display = "block";
      target.textContent = "Hide";
    } else {
      desc.style.display = "none";
      target.textContent = "See more";
    }
  }
});
