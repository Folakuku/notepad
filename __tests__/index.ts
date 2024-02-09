import request from "supertest";
import { app } from "../src/app";

describe("GraphQL API Tests", () => {
  let authToken;
  // authToken =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWJiNDdjZWY0NjA0YWY2MGRjNDdhYTEiLCJlbWFpbCI6InRlc3R1c2VyQGdtYWlsLmNvbSIsImlhdCI6MTcwNzQ4NjQzNSwiZXhwIjoxNzA4MDkxMjM1fQ.Awnuvh4Z8gPRnfrzKWIzTGvQ5Q1vSifTxZj-BwtVcUo";
  // authToken =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWM2MjNhZmNiZDRiZjY1YTVhMGYxNGEiLCJlbWFpbCI6InRlc3R1c2VyQGdtYWlsLmNvbSIsImlhdCI6MTcwNzQ4NDA4NSwiZXhwIjoxNzA4MDg4ODg1fQ.fz1rHziiJCYCM4BLzfbMPq4xqVRsW-HosGNWRSZwaUM";

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
