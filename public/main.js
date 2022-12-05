// Bootstrap Tooltip functionality for the side icons
var tooltipTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="tooltip"]')
);
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});

// JQuery
$(function () {
  // Displays the project in a pop up and displays a canvas behind it
  // Remove the canvas when it's clicked and make body scrollable again
  function projectItem_clickHandler(e) {
    e.preventDefault();
    const clickedProjectKey = $(e.target).parents(".project-item").attr("key");
    const projectPopUp = $(e.target)
      .parents("#projects-list")
      .children(`.project-popup[key=${clickedProjectKey}]`);
    const iframe = projectPopUp.find("iframe");
    if (iframe) {
      iframe.attr("src", iframe.attr("srct"));
    }
    projectPopUp.removeClass("d-none");

    $("#canvas").addClass("shadow");
    $("body").addClass("noscroll");
  }

  let projects = $(".projects-section .project-item .card");
  projects.click(projectItem_clickHandler);

  $("#canvas").click(function (e) {
    e.preventDefault();

    $("iframe").attr("src", "");
    $("#canvas").removeClass("shadow");
    $(".project-popup").addClass("d-none");
    $("body").removeClass("noscroll");
  });

  let a = document.createElement("a");
  a.href = window.location.href;
  const query = a.search.split("=")[0];

  if (query === "?key") {
    const projectItem_key = a.search.split("=")[1];
    const projectItem = $(
      `.projects-section .project-item[key=${projectItem_key}]`
    );
    if (projectItem.length) {
      projectItem.click(projectItem_clickHandler);

      $([document.documentElement, document.body]).animate(
        {
          scrollTop: projectItem.offset().top - "200",
        },
        300
      );
      setTimeout(() => {
        projectItem.find("img").trigger("click");
      }, 800);
    }
  } else if (query === "?result") {
    const reqResult = a.search.split("=")[1];
    let msg = {text:"", class:""};

    switch(reqResult) {
      case "unvalid":
        msg.text = "Please make sure you entered your info correctly.";
        msg.class = "text-danger";
        break;
      case "success":
        msg.text = "Your message have been sent successfully! I'll get back to you as soon as possible.";
        msg.class = "text-success";
        break;
      case "server-error":
        msg.text = "There's currently a problem with the server. Please try again later.";
        msg.class = "text-danger";
        break;
      case "bad-request":
        msg.text = "There's currently a problem with the server. Please try again later.";
        msg.class = "text-danger";
        break;
    }

    if(msg.text){
      $("#contact .container .form-cont").append(`
        <p class="text-center mt-3 fs-4 ${msg.class}">${msg.text}</p>
      `);
    }
  }
});
