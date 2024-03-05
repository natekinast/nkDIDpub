const submitButton = document.getElementById("submitButton");
const urlForm = document.getElementById("urlForm");
const resultsArea = document.getElementById("resultsArea");
let noApplets = false;

urlForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSubmit();
});

function handleSubmit() {
  const url = document.getElementById("urlInput").value;
  if (
    !url.includes(
      "https://digital.greatminds.org/lessons/player/lesson/preview?id="
    )
  ) {
    resultsArea.innerText = "Invalid URL";
    return;
  }

  const spinner = document.getElementById("spinner");

  spinner.style.display = "inline-block";

  getGGBIDs(url).then((lessonIDs) => {
    getCatalogIDs().then((catalogIDs) => {
      const noMatchIDs = checkIDs(lessonIDs, catalogIDs);
      const matchText =
        noMatchIDs.length === 0
          ? noApplets
            ? "No GGB applets found in lesson."
            : "All applets are in EMDigital account."
          : "These applets were not found in EMDigital account:\n" +
            noMatchIDs
              .map((arr) => `GGB ID ${arr[0]} on slide ${parseInt(arr[1]) + 1}`)
              .join("\n");
      resultsArea.innerText = matchText;
      spinner.style.display = "none";
    });
  });
}

async function getCatalogIDs() {
  const catalogIDs = [];
  const authToken =
    "MDBiMWZlODIwYTM2ZjJjNjcxZTBiNzgzZWU2MzNlMGY=|T|1709054891|e2978b2441d1ed8f770078684c9ad39e";
  await fetch(
    `https://api.geogebra.org/v1.0/search/materials?query=%22EM%20Digital%22&lang=en&from=0&size=9999`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        authorization: "Bearer: " + authToken,
      },
    }
  )
    .then((response) => response.json())
    .then((returnObject) => {
      returnObject.hits.forEach((item) => {
        catalogIDs.push(item.id);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      resultsArea.innerText =
        "Error fetching catalog IDs from GeoGebra. Wait a few seconds and try again. If the problem persists, contact Nate.";
    });
  return catalogIDs;
}

async function getGGBIDs(url) {
  const id = url.replace(
    "https://digital.greatminds.org/lessons/player/lesson/preview?id=",
    ""
  );
  const ggbIDs = [];
  await fetch(
    `https://digital.greatminds.org/lessons/api/authoring/v2/preview/version/${id}`,
    {
      headers: {
        authorization: `Basic YXV0aG9yaW5nYWRtaW46WnhDd3RXZmNpNyt0alRLcXJ1eG5kZz09`,
      },
    }
  )
    .then((response) => response.json())
    .then(({ slides }) => {
      slides.forEach((slide, index) => {
        slide.contents
          .filter((content) => content.type === "geogebra")
          .forEach((ggb) => {
            if (!ggbIDs.includes(ggb.config.materialId)) {
              ggbIDs.push([ggb.config.materialId, index]);
            }
          });
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      resultsArea.innerText =
        "Error fetching GGB IDs from lesson. Wait a few seconds and try again. If the problem persists, contact Nate.";
    });
  return ggbIDs;
}

function checkIDs(lessonIDs, catalogIDs) {
  const noMatchIDs = [];
  if (lessonIDs.length === 0) {
    noApplets = true;
  }
  lessonIDs.forEach((id) => {
    if (!catalogIDs.includes(id[0]) && id[0] !== "") {
      noMatchIDs.push(id);
    }
  });
  return noMatchIDs;
}
