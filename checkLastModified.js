javascript:(() => {fetch(document.location).then((response)=>{alert(new Date(response.headers.get('Last-Modified')))});})()
