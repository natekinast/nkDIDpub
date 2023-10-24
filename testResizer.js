function testResizer(name) {
  console.log("testResizer called");
  const parentdiv = document.getElementById(name);
  if (parentdiv !== null) {
    const oldWidth = parentdiv.offsetWidth;
    const cut = 480;
    const resize = function (currentWidth) {
      const isWideEnough = currentWidth >= cut;
      const idealSize = isWideEnough
        ? "18"
        : Math.round((3 * currentWidth) / 80).toString();
      let xmlstring = ggbObject.getXML();
      const parser = new DOMParser();
      const xmldom = parser.parseFromString(xmlstring, "application/xml");
      if (!isWideEnough) {
        xmldom.getElementsByTagName("font")[0].setAttribute("size", idealSize);
        const serializer = new XMLSerializer();
        xmlstring = serializer.serializeToString(xmldom);
        ggbObject.setXML(xmlstring);
      } else if (isWideEnough) {
        xmldom.getElementsByTagName("font")[0].setAttribute("size", idealSize);
        const serializer = new XMLSerializer();
        xmlstring = serializer.serializeToString(xmldom);
        ggbObject.setXML(xmlstring);
      }
    };
    resize(oldWidth);
    const resizeObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function checkMutations(mutation) {
        const currentWidth = mutation.target.offsetWidth;
        resize(currentWidth);
      });
    });
    resizeObserver.observe(parentdiv, {
      attributes: true,
      attributeFilter: ["data-scalex"],
      attributeOldValue: true,
    });
  }
}
