function getCatalogGGBIDs() {
  const catalogIDs = [];
  const authToken =
    "MDBiMWZlODIwYTM2ZjJjNjcxZTBiNzgzZWU2MzNlMGY=|T|1709054891|e2978b2441d1ed8f770078684c9ad39e";
  fetch(
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
      return;
    });
  return catalogIDs;
}

function getLessonGGBIDs() {
  let ggbIDs = [];
  const id = "62e03b976d66fefcf1c10dfc";
  fetch(
    `https://digital.greatminds.org/lessons/api/authoring/v2/preview/version/${id}`,
    {
      headers: {
        authorization: `Basic YXV0aG9yaW5nYWRtaW46WnhDd3RXZmNpNyt0alRLcXJ1eG5kZz09`,
      },
    }
  )
    .then((response) => {
      return response.json();
    })
    .then(({ slides }) => {
      slides.forEach((slide) => {
        slide.contents
          .filter((content) => content.type === "geogebra")
          .forEach((ggb) => {
            if (!ggbIDs.includes(ggb.config.materialId)) {
              ggbIDs.push(ggb.config.materialId);
            }
          });
      });
      return;
    });
  return ggbIDs;
}

function checkIDs(lessonIDs, catalogIDs) {
  const noMatchIDs = [];
  lessonIDs.forEach((id) => {
    if (!catalogIDs.includes(id)) {
      noMatchIDs.push(id);
    }
  });
  return noMatchIDs;
}

const lessonIDs = getLessonGGBIDs();
const catalogIDs = getCatalogGGBIDs();

console.log(lessonIDs);
console.log(catalogIDs);

const noMatchIDs = checkIDs(lessonIDs, catalogIDs);

const matchText =
  noMatchIDs.length === 0
    ? "All applets are in EMDigital account."
    : "These applets were not found in EMDigital account: " +
      noMatchIDs.join(", ");

console.log(matchText);
