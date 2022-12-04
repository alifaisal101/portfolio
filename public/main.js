// Bootstrap Tooltip functionality for the side icons
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

// JQuery
$(function () {
  // Displays the project in a pop up and displays a canvas behind it
  // Remove the canvas when it's clicked and make body scrollable again
  function projectItem_clickHandler(e) { 
    e.preventDefault();
    const clickedProjectKey = $(e.target).parents(".project-item").attr("key");
    const projectPopUp = $(e.target).parents("#projects-list").children(`.project-popup[key=${clickedProjectKey}]`);
    const iframe = projectPopUp.find("iframe")
    if(iframe) {
      iframe.attr("src",iframe.attr("srct"))
    }
    projectPopUp.removeClass("d-none");

    $("#canvas").addClass("shadow");
    $("body").addClass("noscroll");
  }

  let projects = $(".projects-section .project-item .card");
  projects.click(projectItem_clickHandler);

  $("#canvas").click(function(e) {
    e.preventDefault();

    $("iframe").attr("src","")
    $("#canvas").removeClass("shadow");
    $(".project-popup").addClass("d-none");
    $("body").removeClass("noscroll");
  });

  let a = document.createElement("a");
  a.href = window.location.href;
  const projectItem_key = a.search.split('=')[1];
  if(projectItem_key){
    const projectItem = `.projects-section .project-item[key=${projectItem_key}]`;
    $(projectItem).click(projectItem_clickHandler);

    $([document.documentElement, document.body]).animate({
      scrollTop: $(projectItem).offset().top - "200"
      
  }, 300);
    setTimeout(() => {
    $(`${projectItem} img`).trigger('click');
    },800)
  }
});