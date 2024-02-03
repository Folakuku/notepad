// __tests__/api.test.ts
import request from "supertest";
import { app } from "../src/app";

describe("GraphQL API Tests", () => {
  let authToken;
  authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWJiNDdjZWY0NjA0YWY2MGRjNDdhYTEiLCJlbWFpbCI6InRlc3R1c2VyQGdtYWlsLmNvbSIsImlhdCI6MTcwNjc3NTk5NCwiZXhwIjoxNzA2OTQ4Nzk0fQ.AjkAC__5zmWR_PvZgyUV6L99_6hIcNpY1H-EmJHybjg";

  beforeAll(async () => {
    const response = await request(app)
      .post("/graphql")
      .send({
        query: `mutation { 
          login ( email: testuser@gmail.com, password: password) {
            token
            user {
              username
            }
          }
        }`,
      });

    // authToken = response.body.login.token;
  });

  it("should get current user", async () => {
    const response = await request(app)
      .post("/graphql")
      .send({
        query: "{ currentUser { _id, username }  }",
      })
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);

    const { data } = response.body;
    expect(data.currentUser).toBeDefined();
    expect(data.currentUser.username).toEqual("Testuser");
  });

  it("should login", async () => {
    const response = await request(app)
      .post("/graphql")
      .send({
        mutation: `{ login (email:"testuser@gmail.com" ,password : "password") {token user {username}}`,
      })
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);

    const { data } = response.body;
    expect(data).toBeDefined();
    expect(data.login).toBeDefined();
    expect(data.login.user.username).toEqual("Testuser");
  });

  // it("should create a new note", async () => {
  //   const response = await request(app)
  //     .post("/graphql")
  //     .send({
  //       query:
  //         'mutation { createNote( { title: "Test Note", content: "This is a test note" }) { id, title } }',
  //     })
  //     .set("Authorization", `Bearer ${authToken}`)
  //     .expect(200);

  //   const { data } = response.body;
  //   expect(data.createNote).toBeDefined();
  //   expect(data.createNote.title).toEqual("Test Note");
  // });
});
