(function() {
    // var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.flickr.com/services/rest/?method=flickr.favorites.getPublicList&api_key=25087e994d7f8eca9e31016fbcb58e89&user_id=155573498%40N02&extras=url_q&per_page=50&format=json&nojsoncallback=1&auth_token=72157696133274612-a6e48b53dbd4ec4b&api_sig=6e8cef140656cfd6d829a686352e870f', true);
    xhr.send();

    
xhr.onreadystatechange = function() {

    if (this.readyState != 4) return;

    if (xhr.status != 200) {
        console.log( xhr.status + ': ' + xhr.statusText ); // 404: Not Found
      } 
        
        var response = JSON.parse(xhr.responseText);
        var photos = response.photos.photo;
        

            for(let i = 0; i < photos.length; i++) {
                let wrap_img = document.createElement("div");
                wrap_img.className = "img-wrap";
                var img = new Image();
                img.src = photos[i].url_q;
                img.alt = photos[i].title;
                img.tabindex = i;

                wrap_img.appendChild(img);

                document.getElementById('images').appendChild(wrap_img);
            }

}


    // var flickerAPI = "https://api.flickr.com/services/rest/?method=flickr.favorites.getPublicList&api_key=25087e994d7f8eca9e31016fbcb58e89&user_id=155573498%40N02&extras=url_q&per_page=50&format=json&nojsoncallback=1&auth_token=72157696133274612-a6e48b53dbd4ec4b&api_sig=6e8cef140656cfd6d829a686352e870f";
    // $.getJSON( flickerAPI, {
    // // tags: "mount rainier",
    // // tagmode: "any",
    // // format: "json"
    // })
    // .done(function( data ) {
    //     $.each( data.photos.photo, function( i, item ) {
        
    //     $("<div class='img-wrap'></div>")
    //         .appendTo( "#images" )
    //         .append($( "<img>" )
    //         .attr( "src", item.url_q )
    //         .attr("alt", item.title));

    //         console.log(i);
            
    //         if ( i === 50 ) {
    //             return false;
    //         }

    //     });
    //     console.log(data.photos.photo);
        
    // });
})();
   
