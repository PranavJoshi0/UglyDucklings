
function processGrid(rowCount, columnCount, width, height, boxSize) {
  project.clear();
  const graph = new Graph(rowCount, columnCount, Box);
  graph.createGrid();
  graph.process();
  states.Context.ActiveGrid = new Grid(width, height, graph, boxSize);
  states.Context.Runner = new Runner(states.Context.ActiveGrid);
  states.Context.Runner.paintGrid();

  states.Context.ActiveGrid.onStartEndSet = function() {
    if (
      states.Context.ActiveGrid.startNode != null &&
      states.Context.ActiveGrid.endNode != null
    ) {
      //states.randomWallGenerator.prop("disabled", true);
      }
  };

  states.Context.Runner.onRunnerStop = function() {
    states.runnerDuration.text(
      `${states.Context.Runner.duration} ms`
    );
  };
  states.algoNameDisplay.text(states.Context.Runner.finderName);
}

function init() {
  var boxSize = states.DEFAULT_BOX_SIZE;
  var [rowCount, columnCount] = Utils.getRowColumnCount(boxSize);
  states.toolModeInput.change(function(event) {
    states.Context.ActiveGrid.actionMode = states.TOOL_MODE[this.value];
  });

  states.clearGraphBtn.click(function(event) {
    states.Context.Runner.clearGrid();
  });
  states.resetGraphBtn.click(function(event) {
    states.Context.Runner.resetGrid();
  });

  $('.option_label').click(function(event) {
    $(this).prev().click();
  });

  /*window.onclick = function(event) {
    // When clicked outside dropdown
    if (!event.target.matches('.dropdown-button')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
    }
  }*/

  function getSpeed() {
    const runner = states.Context.Runner;
    const speed = $('input[name="speed-choice"]:checked').val();//event.target.dataset["speed"];
    runner.speed = states.RunnerSpeeds[speed];
    states.speedNameDisplay.text(speed);
  };

  states.startStopBtn.click(function(event) {
    if(states.Context.FREE && states.Context.ActiveGrid.startNode != null && states.Context.ActiveGrid.endNode != null)
    {
      //console.log("WE'RE IN!");
      states.Context.Runner.resetGrid();
      states.Context.Runner.getAlgo();
      getSpeed();
      states.Context.Runner.init();
      states.startStopBtn.text("Visualize").prop("disabled", false);
      states.runnerDuration.text(states.Context.Runner.duration);
      if(!states.Context.Runner.running)
      {
        states.Context.Runner.onRunnerStop();
      }
    }
  });

  /*states.admissibleValue.change(function(event) {
    if (this.value < 1 || this.value > 100) {
      $(this).val(1);
    }
    states.Context.AdmissibleValue = this.value;
    states.admissibleValueDisplay.text(this.value);
  });*/

  processGrid(rowCount, columnCount, states.width, states.height, boxSize);
}

paper.install(window);
$(document).ready(function(_) {
  paper.setup("graph-canvas");
  init();
});

$(function() {
  $('[data-toggle="popover"]').popover();
  $('[data-toggle="tooltip"]').tooltip();
});

$(".dropdown-menu a.dropdown-toggle").on("click", function(e) {
  if (
    !$(this)
      .next()
      .hasClass("show")
  ) {
    $(this)
      .parents(".dropdown-menu")
      .first()
      .find(".show")
      .removeClass("show");
  }
  var $subMenu = $(this).next(".dropdown-menu");
  $subMenu.toggleClass("show");

  $(this)
    .parents("li.nav-item.dropdown.show")
    .on("hidden.bs.dropdown", function(e) {
      $(".dropdown-submenu .show").removeClass("show");
    });

  return false;
});
