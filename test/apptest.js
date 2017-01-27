var app = require('../server/webapp.service')();
var expect = require('chai').expect;
var assert = require('chai').assert;
var request = require("supertest");
var moduleToTest = require('../server/crawler/crawlerNeo4jController').getTerms;
request = request(app);
describe("Make GET requests to domain ", function() {
	it('Simple GET Request to root url', function(done) {
		request.get('/').expect(200, done);

	});

	it('Testing for not defined route', function(done) {
		request.get('/_undefined_route').expect(404, done);
		this.timeout(10000)

	});
});

describe("Make GET requests to domain :", function() {
	it('Testing for all domains', function(done) {
		request.get('/domain').expect(200, done);
		this.timeout(10000);
	});
});


describe("Make GET requests to domain along with domain name ", function() {
	it('Testing for a domain which is not present', function(done) {
		request.get('/domain/nullDomain').
		expect({ error: 'Null domain object while retriving the domain from mongo..!' }, done);
		this.timeout(10000);
	});
});


describe("Make post requests to domain along with domain name ", function() {
	it("Testing for publishing a new domain it should return status", function(done) {
		request
		.post('/domain/java')
		.send({
			"name": "Java",
			"description": "No description",
			"domainImgURL": "no url"
		}).end(function(err, res) {
			if(err)
			{
				done(err);
			}	
			expect(Object.keys(res.body)).to.be.not.equal(undefined);
			done();
			this.timeout(10000);

		});
	});

});


// describe("Make GET requests to docSearchJob ", function() {
//   it('Simple GET Request to root url', function(done) {
//     request.get('/').expect(200, done);
//   });
// });


// describe("Make POST request to add jobs ", function() {
//   it('Simple POST request test for adding job', function(done) {
//     request.post('/docsearchjob/job')
//       .send({
//         query: "react",
//         engineID: "009216953448521283757:ibz3hdutpom AIzaSyDY5SnIb4vsmGwteTes7VPbi_1_TFV-T1U",
//         exactTerms: "jsx",
//         results: "2",
//         siteSearch: "NONE"
//       })
//       .end(function(err, res) {
//         expect(Object.keys(res.body)).to.have.lengthOf(6);
//         done();
//       });
//   });
// });

// describe("Make GET request to show the results ", function() {
//   it('Simple GET request test for viewing all the results', function(done) {
//     request.get('/docsearchjob/show')
//       .end(function(err, res) {
//         expect('Content-Type', 'application/json; charset=utf-8', done);
//         done();
//         this.timeout(10000);
//       });
//   });
// });

// describe("Make GET request to show the results ", function() {
//   it('Simple GET request test for viewing the results for a particular job id', function(done) {
//     request.get('/docsearchjob/585cb4cf0384402018145166')
//       .end(function(err, res) {
//         expect('Content-Type', 'application/json; charset=utf-8', done);
//         done();
//         this.timeout(10000);

//       });
//   });
//   it('Simple GET request test for viewing the results for a wrong job id', function(done) {
//     request.get('/docsearchjob/rr585cb4cf0384402018145166')
//       .end(function(err, res) {
//         expect({
//           error: 'Something went wrong, please try later..!'
//         }, done);
//         done();


//       });
//   });

// });

// describe("Make DELETE request to delete the results ", function() {
//   it('Simple DELETE request TO delete the results for a particular job id', function(done) {
//     request.get('/docsearchjob/585cb4cf0384402018145166')
//       .end(function(err, res) {
//         expect('Content-Type', 'application/json; charset=utf-8', done);
//         done();
//         this.timeout(10000);

//       });
//   });
// });

describe("fetching terms from the domain which is not present", function() {
	let domainObj = {
		domain: "no_domain",
		concept:"no_domain"
	};

	it('trying to get the Terms of domain which is not there', function() {

		expect(Object.keys(moduleToTest(domainObj))).to.have.lengthOf(0);
		
	});

}); //end of describe
