/*********************************
Initialization
*********************************/
var topics = [
    "Starwars",
    "Epic Fails",
    "Jokes",
    "Hockey Hits",
    "Step brothers",
    "Deadpool",
    "Star Trek"
  ];
  // Gify API stuff
  var endpoint  = "https://api.giphy.com/v1/gifs/search";
  var gifyAPI   = "5BiqqCsgIvHAkB6bBh1IwDeG7TWAbDnV";
  var limit     = 15;
  var rating    = "g";
  
  /*********************************
  Functions
  *********************************/
  function renderButtons(renderLast) {
    $(".buttons").empty();
    for (var i = 0; i < topics.length; i++) {
      var b = $("<button>");
      $(b).addClass("topic btn btn-primary");
      $(b).html(topics[i]);
      $(".buttons").append(b);
    }
  
    $(".topic").click(function() {
      fetchGifs(this);
    });
  
    if (renderLast) {
      fetchGifs(".topic:last");
    }
  }
  
  function fetchGifs(topic) {
    // console.log(topic);
    // Set button state to active
    $(".buttons .active").removeClass("active");
    $(topic).addClass("active");
    // set up query string
    query = {
      "api_key"   : gifyAPI,
      "q"         : $(topic).html(),
      "limit"     : limit,
      "rating"    : rating
    };
    query = $.param(query);
    path = endpoint + "?" + query;
    // make the ajax call!
    $.ajax({
      url: path,
      type: 'GET',
    })
    .done(function(response) {
      // console.log(response);
      // Clear old gifs
      $(".card-columns").empty();
      // Loop through results
      var gifArray = response.data;
      for (var i = 0; i < gifArray.length; i++) {
        // Build card (Bootrap 4 component)
        var imgSrc = gifArray[i].images.downsized_still.url;
        var imgLink = gifArray[i].url;
        var embedLink = gifArray[i].embed_url;
        // Store lots of HTML in a card array
        var card = [
          "<div class='card'>",
          "<img class='card-img-top' src='"+imgSrc+"'>",
          "<div class='card-block'>",
          "<a href='"+imgLink+"' target='_blank' class=''><i class='fa fa-external-link' aria-hidden='true'></i>View on Giphy</a> ",
          "<a class='clip' data-toggle='tooltip' title='Copied!' data-clipboard-text='"+embedLink+"' href='#'><i class='fa fa-clipboard' aria-hidden='true'></i> Copy embed link</a>",
          "</div>",
          "<div class='card-footer card-inverse text-muted'>Rating: "+gifArray[i].rating.toUpperCase(),
          "</div>",
          "</div>"
        ];
        // Use join to concatenate html block in the card array
        $(".card-columns").prepend(card.join(''));
      }
    })
    .fail(function() {
      console.log("error");
    });
  }
  
  function togglePlay(card) {
    // Fetch the url of the clicked image
    var imgPath = $(card).attr("src");
    // Does it end with "_s.gif"?
    if (imgPath.endsWith("_s.gif")) {
      imgPath = imgPath.replace("_s.gif", ".gif");
    } else {
      imgPath = imgPath.replace(".gif", "_s.gif");
    }
    // Update image path
    $(card).attr("src", imgPath);
  
  }
  
  /*********************************
  App
  *********************************/
  $(document).ready(function() {
  
    renderButtons();
  
    $(".rating label").change(function(event) {
      rating = $(this).text().trim().toLowerCase();
      // console.log(rating);
    });
  
    $("form").submit(function(event) {
      event.preventDefault();
      newTopic = $("#feeling").val().trim();
      if(newTopic !== "") {
        topics.push($("#feeling").val().trim());
        renderButtons(true);
      }
      // clear the input
      this.reset();
    });
  
    // For some reason, I had to bind the click event using this syntax,
    // even though click() worked fine for the .topic buttons, which are
    // also dynamically generated.
    $(".gifs").on("click", ".card-img-top", function() {
      togglePlay(this);
    });
  
    $(".gifs").on("click", ".clip", function(event) {
      event.preventDefault();
    });
  
    // Tooltip functionality, what a pain in the ass
    // See Bootstrap 4 docs for explanation
    clipboard = new Clipboard('.clip');
    clipboard.on('success', function(e) {
        e.clearSelection();
        if(e.action === "copy") {
          $(e.trigger).tooltip("show");
        }
    });
  
  });