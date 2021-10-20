let express = require('express');
let app = express();
let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
let axios = require('axios');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const getData = async () => {
	return new Promise((resolve, reject) => {
		axios('https://jsonplaceholder.typicode.com/todos/1')
    .then(function (response) {
			console.log('response: ', response);
			let dataReturn = []
			dataReturn.push(response.data)
      resolve(dataReturn);
    })
    .catch(function (error) {
      return error;
    });
	})
  
};

// let students = [
//   {
//     name: 'Nguyen Hai Linh',
//     email: 'mrlinhdeptrai98@gmail.com',
//     city: 'Bac Ninh',
//     country: 'Vietnam',
//   },
//   {
//     name: 'Nguyen Van A',
//     email: 'nguyenvana@gmail.com',
//     city: 'Ha Noi',
//     country: 'Viet Name',
//   },
//   {
//     name: 'Nguyen Van B',
//     email: 'nguyenvanb@example.com',
//     city: 'Hai Duong',
//     country: 'Vietnam',
//   },
// ];

app.get('/generateReport', async (req, res) => {
  try {
    let students = await getData();
		console.log('students: ', students);
    ejs.renderFile(
      path.join(__dirname, './views/', 'report-template.ejs'),
      {
        students: students,
      },
      (err, data) => {
        if (err) {
          console.log('error: ', err);
          res.send(err);
        } else {
          let options = {
            height: '11.25in',
            width: '8.5in',
            header: {
              height: '20mm',
            },
            footer: {
              height: '20mm',
            },
          };
          pdf.create(data, options).toFile('report.pdf', function (err, data) {
            if (err) {
              console.log('error: ', err);

              res.send(err);
            } else {
              res.render('report-template', {
                students: students,
              });
              // res.send('File created successfully');
            }
          });
        }
      },
    );
  } catch (error) {
		console.log('error: ', error);
    res.json(error);
  }
});

app.listen(3000, () => {
  console.log('server 3000');
});
