console.log('hello')
$.ajax({
    url: "http://localhost:3000/api/getWeather",
    data: {
      zipcode: 97201
    },
    success: function( result ) {
      console.log(result)
    }
})