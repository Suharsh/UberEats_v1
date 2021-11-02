const assert = require("chai").assert;
const index = require("../../index");
const chai = require("chai");
chai.use(require("chai-http"));
const expect = require("chai").expect;
const agent = require("chai").request.agent(index);

describe("Restaurant Details", function () {
    it("should return all restaurants", () => {
      agent
        .get("/uber-eats/api/restaurants")
        .then(function (res) {
           expect(res.body.length).to.not.equal(0);
        })
        .catch((error) => {
           assert.fail("An error occured. Please check the logs");
        });
    });
});