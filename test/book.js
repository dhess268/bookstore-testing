let Book = require("../app/models/book");

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");

let should = chai.should();

chai.use(chaiHttp);

beforeEach(()=> {
  Book.removeAll()
})
describe("Books", () => {
  describe("/GET book", () => {
    it("it should GET all the books", (done) => {
      chai
        .request(server)
        .get('/book')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an("array")
          res.body.length.should.be.eql(0)
          done()
        })
    });
  });
  describe('/POST book', (done) => {
    it('it should POST a book ', done => {
      // arrange
      let book = {
        title: 'The Hunger Games',
        author: 'Suzanne Collins',
        year: 2008,
        pages: 301
      };
      chai
        .request(server)
        .post('/book')
        .send(book)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          res.body.should.have.property('title')
          res.body.should.have.property('author')
          res.body.should.have.property('year')
          res.body.should.have.property('pages')
          done()
        })
    });
    it('it should not POST a book without pages field', (done) => {
      //  arrange
      let book = {
        title: 'The Hunger Games',
        author: 'Suzanne Collins',
        year: 2008,
      };
      chai
        .request(server)
        .post('/book')
        .send(book)
        .end((err, res) => {
          res.should.have.status(400)
          done()
        })
    })
  });
});

describe("Books by ID", () => {
  describe("/GET book by ID", () => {
    it("it should GET a book by the given id", (done) => {  
      
      Book.addBook({
        title: 'The Hunger Games',
        author: 'Suzanne Collins',
        year: 2008,
        pages: 301
      })
      chai.request(server)
        .get('/book/2')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          res.body.should.have.property('title')
          res.body.should.have.property('author')
          res.body.should.have.property('year')
          res.body.should.have.property('pages')
          done()
        })

    });
  });
  it('it should not GET a book if there is no book with the id queried', (done) => {
    chai
      .request(server)
      .get('/book/10000')
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })
  })

  describe('/PUT book by id', () => {
    it('it should update the book with specified id', (done) => {
      Book.addBook({
        title: 'The Hunger Games',
        author: 'Suzanne Collins',
        year: 2008,
        pages: 301
      })

      let newBook = {
        title: 'HP',
        author: 'jkTerf',
        year: 2000,
        pages: 200,
        id:3
      }

      chai
        .request(server)
        .put('/book/3')
        .send(newBook)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.deep.eql(newBook)
          done()
        })
    })
    it('it should return an error if there is no book found with the given id', (done) =>{ 
      Book.addBook({
        title: 'The Hunger Games',
        author: 'Suzanne Collins',
        year: 2008,
        pages: 301
      })
      let newBook = {
        title: 'HP',
        author: 'jkTerf',
        year: 2000,
        pages: 200,
        id:3
      }
      chai
        .request(server)
        .put('/book/1001201')
        .send(newBook)
        .end((err, res) => {
          res.should.have.status(404)
          done()
        })
    })
  })

  describe('/DELETE book by id', () => {
    it('it should delete the book with specified id', (done) => {
      Book.addBook({
        title: 'The Hunger Games',
        author: 'Suzanne Collins',
        year: 2008,
        pages: 301
      })

      chai
        .request(server)
        .delete('/book/5')
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
    })
  
    it('it should return an error if there is no book found with the given id', (done) =>{ 
      Book.addBook({
        title: 'The Hunger Games',
        author: 'Suzanne Collins',
        year: 2008,
        pages: 301
      })
      chai
        .request(server)
        .delete('/book/1001201')
        .end((err, res) => {
          res.should.have.status(404)
          done()
        })
    })
  })

});

