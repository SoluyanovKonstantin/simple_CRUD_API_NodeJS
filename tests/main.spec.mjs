import http from "http";

it("resource should not found", (done) => {

  http.get('http://localhost:3000/dqwdqw', (res) => {
    res.setEncoding('utf8');
    if (res.statusCode !== 404) throw new Error('405');
    res.on('data', function (chunk) {
        if(chunk !== 'Such resource not found') throw new Error('Such resource not found');

        done();
    });
  })
});

it("resource return 500", (done) => {

  http.get('http://localhost:3000/api/500', (res) => {
    res.setEncoding('utf8');
    if (res.statusCode !== 500) throw new Error('500');

    done();
  })
});

it("should return an array", (done) => {

  http.get('http://localhost:3000/api/users', (res) => {
    res.setEncoding('utf8');
    if (res.statusCode !== 200) throw new Error('');
    res.on('data', (chunk) => {
      if(!Array.isArray(JSON.parse(chunk)))
        throw new Error();
      done();
    });
  })
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/users',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
};

it("should create an user", (done) => {
  const req = http.request(options, (res) => {
    res.setEncoding('utf8');

    if (res.statusCode !== 201) throw new Error(res.statusCode);

    http.get('http://localhost:3000/api/users', (res) => {
    res.setEncoding('utf8');
    if (res.statusCode !== 200) throw new Error('');
      res.on('data', (chunk) => {
        const arr = JSON.parse(chunk);
        const usr = arr[arr.length - 1];
        if(usr?.username !== 'test' || usr?.age !== 12 || usr.hobbies.length !== 0) throw new Error('');
        done();
      });
    })
  })

  const postData = JSON.stringify({
    username: 'test',
    age: 12,
    hobbies: []
  });

  req.write(postData);
  req.end();
})

it("Should not create an user without required field", (done) => {
  const req = http.request(options, (res) => {
    res.setEncoding('utf8');

    if (res.statusCode === 400) done();
    else throw new Error('Wrong code');
  })

  const postData = JSON.stringify({
    username: 'test',
    hobbies: []
  });

  req.write(postData);
  req.end();
})