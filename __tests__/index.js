// import request from "supertest";
// import { app } from "../src/app";
const request = require("supertest");
const { app } = require("../src/app");

describe("GraphQL API Tests", () => {
  let authToken;

  beforeAll(async () => {
    const response = await request(app)
      .post("/graphql")
      .send({
        query: `mutation Login($email: String!, $password: String!){
          login(email: $email, password: $password) {
            token
          }
        }`,
        variables: { email: "testuser@gmail.com", password: "password" },
      });

    authToken = response.body.data.login.token;
  });

  it("should get current user", async () => {
    const response = await request(app)
      .post("/graphql")
      .send({
        query: "query { currentUser { _id, username }  }",
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
        query: `mutation Login($email: String!, $password: String!){ 
          login(email: $email, password: $password) {
            token
            user {
              username
            }
          }
        }`,
        variables: { email: "testuser@gmail.com", password: "password" },
      })
      .expect(200);

    const { data } = response.body;
    expect(data).toBeDefined();
    expect(data.login.token).toBeDefined();
    expect(data.login.user.username).toEqual("Testuser");
  });

  it("should create a new note", async () => {
    const response = await request(app)
      .post("/graphql")
      .send({
        query: `mutation AddNote($title: String!, $content: String!){
            addNote(title: $title, content: $content) {
              title
              content
            }
          }`,
        variables: {
          title: "Test Note",
          content: "The world is a wonderful place",
        },
      })
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);

    const { data } = response.body;
    expect(data.addNote).toBeDefined();
    expect(data.addNote.title).toEqual("Test Note");
  });
});
