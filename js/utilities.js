async function loadComponent(id, file) {
  const response = await fetch(file);
  const text = await response.text();

  document.getElementById(id).innerHTML = text;
}

const resizeObserver = new ResizeObserver(() => {
  document.body.classList.add("resizing");

  requestAnimationFrame(() => {
    document.body.classList.remove("resizing");
  });
});

resizeObserver.observe(document.body);

export { loadComponent };
