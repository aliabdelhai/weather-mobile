class Renderer {
    renderData(allCityData) {
        if (allCityData) {
            $(".cities").html("")
            const source = $('#city-template').html();
            const template = Handlebars.compile(source);
            const newHTML = template({allCityData});
            $(".cities").append(newHTML);
        }
    }

    renderDelete(){
        const source = $('#delete-template').html();
        const template = Handlebars.compile(source);
        const newHTML = template();
        $(".cities").append(newHTML);

    }



}