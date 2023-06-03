var ElementShell = document.querySelector(".element-shell");
var FileURLs = [];

var SearchBar = document.querySelector(".search-bar");
var SearchButton = document.querySelector(".search-button");

var Safety = true;
if (Safety) {
    ElementShell.classList.add("display-none")
}

try {
    var tags = window.location.href.split("?")[1].split("%20").join(" ");
    SearchBar.value = tags
}
catch {
    var tags = window.location.href.split("?")[1];
    SearchBar.value = tags
}
if (tags == undefined) {
    tags = "waero gif"
    SearchBar.value = tags
}
console.log(window.location)
console.log(tags)
var PageNumber = 1;
var isLoading = false; // Flag to track whether data is being loaded
var BaseWindowURL = window.location.origin

function Search() {
    window.open(`${BaseWindowURL}?${SearchBar.value}`, "_self")
}
SearchButton.onclick = Search

function handleEnterKeyPress(event) {
    if (event.key === "Enter" || event.keyCode === 13) {
      // Call your function here
      Search();
    }
  }
SearchBar.addEventListener("keydown", handleEnterKeyPress)

document.addEventListener("keydown", function(event) {
    if (event.key === "l") {
      // Call your function here for Enter key press
      ElementShell.classList.toggle("display-none")
    }
  });

function AddElements(Tags) {
  if (isLoading) {
    return; // If data is already being loaded, exit the function
  }

  isLoading = true; // Set the flag to indicate data is being loaded

  const apiKey = '8iuKM7gbTomg3hcCoMNHAEfH';
  const urlFiller = `https://danbooru.donmai.us/posts.json?api_key=${apiKey}&login=6e616d6577617374616b656e&tags=${Tags}&page=${PageNumber}`;

  fetch(urlFiller)
  .then(response => response.json())
  .then(data => {
    for (let i = 0; i < data.length; i++) {
      var CurrentFileURL = data[i].large_file_url;
      if (CurrentFileURL == undefined) {
        CurrentFileURL = data[i].file_url;
      }

      FileURLs.push(CurrentFileURL);

      try {
        var FileSplitLength = CurrentFileURL.split(".").length;
        var FileType = CurrentFileURL.split(".")[FileSplitLength - 1];

        var anchorElement = document.createElement("a");
        anchorElement.setAttribute("data-src", CurrentFileURL);
        anchorElement.setAttribute("data-fancybox", FileType === "webm" || FileType === "mp4" ? "video-gallery" : "gallery");

        if (FileType == "png" || FileType == "jpg" || FileType == "gif" || FileType == "webp") {
          var NewImageElement = document.createElement("img");
          NewImageElement.src = CurrentFileURL;
          NewImageElement.classList.add(FileType);
          NewImageElement.id = data[i].tag_string_character.split(" ")[0];

          NewImageElement.addEventListener('click', function(event) {
            if (event.ctrlKey) {
              console.log(this.id);
              window.open(`${BaseWindowURL}?${this.id}`, "_blank");
            } else if (event.shiftKey) {
              event.preventDefault();
              console.log(this.id);
              window.open(`${BaseWindowURL}?${this.id}`, "_self");
            }
          });

          anchorElement.appendChild(NewImageElement);
        } else if (FileType == "webm" || FileType == "mp4") {
          var NewVideoElement = document.createElement("video");

          NewVideoElement.autoplay = true;
          NewVideoElement.loop = true;
          NewVideoElement.muted = true;
          NewVideoElement.controls = true;

          var sourceElement = document.createElement("source");
          sourceElement.src = CurrentFileURL;
          sourceElement.type = `video/${FileType}`;

          NewVideoElement.appendChild(sourceElement);
          anchorElement.appendChild(NewVideoElement);
        }

        ElementShell.appendChild(anchorElement);
      } catch {
        console.log("ERROR MAKING IMAGE, GOING ON TO THE NEXT");
      }
    }

    isLoading = false; // Reset the flag after data is loaded
  })
  .catch(error => {
    isLoading = false; // Reset the flag in case of error
    console.error('Error:', error);
  });

}

AddElements(tags);

function handleScrollToBottom() {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

  if (scrollPosition + windowHeight >= documentHeight) {
    PageNumber++;
    AddElements(tags);
  }
}

window.addEventListener('scroll', handleScrollToBottom);

document.addEventListener("DOMContentLoaded", function() {
    var images = document.querySelectorAll("[data-fancybox='images']");
    
    images.forEach(function(image) {
      image.addEventListener("click", function() {
        // Initialize FancyBox
        var fancyBox = new Fancybox(image, {
          afterShow: function(instance, current) {
            var currentIndex = current.index;
            var totalImages = instance.group.length;
  
            if (currentIndex === totalImages - 1) {
              // Call your function when reaching the end
              console.log("Reached the end of scrolling through images");
              yourFunction(); // Replace `yourFunction` with the function you want to call
            }
          }
        });
  
        // Open the clicked image in FancyBox
        fancyBox.open();
      });
    });
  });