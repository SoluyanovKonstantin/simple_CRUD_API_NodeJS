const url = 'http://localhost:3000/api/'
let users;

$('#getUsers').on('click', () => {
  $.ajax({
    type: 'GET',
    url: `${url}users`,
    dataType: 'JSON',
    success: function( result ) {
      users = result;
    }
  })
})

$('#getUser').on('submit', function (ev) {
  ev.preventDefault();
  let data = {};
  $(this).serializeArray().map(value => {
    data[value.name] = value.value;
  })

  $.ajax({
    type: 'GET',
    url: `${url}users/${data.id}`,
    dataType: 'JSON',
    success: function( result ) {
    }
  })
})

$('#createUser').on('submit', function (ev) {
  ev.preventDefault();
  let data = {};
  $(this).serializeArray().map(value => {
    data[value.name] = value.value;
  })

  data['hobbies'] = [];

  $('.hobbies').each((index, element) => {
    if(element.value)
      data['hobbies'].push(element.value);
  });

  $.ajax({
    type: 'POST',
    url: `${url}users`,

    data: JSON.stringify(data),
    contentType:"application/json; charset=utf-8",
    success: function( result ) {
    }
  })
})

$('#deleteUser').on('submit', function (ev) {
  ev.preventDefault();
  let data = {};
  $(this).serializeArray().map(value => {
    data[value.name] = value.value;
  })

  $.ajax({
    type: 'DELETE',
    url: `${url}users/${data.id}`,

    success: function( result ) {
    }
  })
})

$('#updateUser').on('submit', function (ev) {
  ev.preventDefault();
  let data = {};
  $(this).serializeArray().map(value => {
    data[value.name] = value.value;
  })


  $('.hobbies_edit').each((index, element) => {
    if(element.value && data['hobbies'].length)
      data['hobbies'].push(element.value);
    else if(element.value)
      data['hobbies'] = [element.value];
  });

  const id = data.id;
  data.id = undefined;

  $.ajax({
    type: 'PUT',
    url: `${url}users/${id}`,
    contentType:"application/json; charset=utf-8",

    data: JSON.stringify(data),
    success: function( result ) {
    }
  })
})

function addHobbie(id = 'hobbies') {
  $('#' + id).append(`<input type="string" class="${id}" name="hobbies" placeholder="Хобби">`)
}
