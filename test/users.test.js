
import { describe, it, after, before } from "mocha";
import supertest from "supertest";
import { expect } from "chai";
import { connDB } from '../src/config/db.js';
import { config } from '../src/config/config.js';
import mongoose from "mongoose";

const requester = supertest(`http://localhost:${config.GENERAL.PORT ?? 3000}`);

// Conectar a MongoDB con el nombre de la base de datos
await connDB(config.DATABASE.MONGO_URL, config.DATABASE.DB_NAME);

describe("Prueba router users", function () {
    this.timeout(10_000);

    let userId;
    const userEmail = "testuser@example.com";

    before(async function() {
        await mongoose.connection.collection("users").deleteOne({ email: userEmail });
    })

    after(async () => {
        if (userId) {
            await mongoose.connection.collection("users").deleteOne({ _id: new mongoose.Types.ObjectId(userId) });
        }
    });

    describe("POST api/sessions/register", () => {
        it("Si envio los datos completos de un usuario a api/sessions/register con POST, deberia devolver un status 201, un usuario con su id y una cookie de autenticación", async () => {
            const mock = {
                first_name: "Test",
                last_name: "User",
                email: userEmail,
                password: "password123",
            };
            const response = await requester.post("/api/sessions/register").send(mock);      
            expect(response.statusCode).to.equal(201);
            expect(response.body.payload).to.have.property("id");
            userId = response.body.payload.id;
        });

        it("Debería devolver un status 400 si faltan campos requeridos", async () => {
            const mock = {
                first_name: "Test"
            };
            const response = await requester.post("/api/sessions/register").send(mock);
            expect(response.statusCode).to.equal(400);
        });

        it("Debería devolver un status 409 si el correo ya existe", async () => {
            const mock = {
                first_name: "Test",
                last_name: "User",
                email: userEmail,
                password: "password123",
            };
            const response = await requester.post("/api/sessions/register").send(mock);
            expect(response.statusCode).to.equal(409);
        });
    });

    describe("GET /api/users", () => {
        it("Debería devolver un status 200 y un objeto con un array de usuarios", async () => {
            const response = await requester.get("/api/users");
            expect(response.statusCode).to.equal(200);
            expect(response.body).to.be.an("object");
            expect(response.body.payload).to.be.an("array");
        });
    });

    describe("PUT /api/users/:uid", () => {
        it("Debería actualizar un usuario y devolver un status 200", async () => {
            const updateMock = {
                first_name: "Test User Updated"
            };
            const response = await requester.put(`/api/users/${userId}`).send(updateMock);
            expect(response.statusCode).to.equal(200);
            expect(response.body.payload.first_name).to.equal("Test User Updated");
        });

        it("Debería devolver un status 400 si el id es inválido", async () => {
            const response = await requester.put("/api/users/invalidId").send({ first_name: "test" });
            expect(response.statusCode).to.equal(400);
        });

        it("Debería devolver un status 404 si el usuario no se encuentra", async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await requester.put(`/api/users/${nonExistentId}`).send({ first_name: "test" });
            expect(response.statusCode).to.equal(404);
        });
    });

    describe("DELETE /api/users/:uid", () => {
        it("Debería eliminar un usuario y devolver un status 200", async () => {
            const response = await requester.delete(`/api/users/${userId}`);
            expect(response.statusCode).to.equal(200);
        });

        it("Debería devolver un status 400 si el id es inválido", async () => {
            const response = await requester.delete("/api/users/invalidId");
            expect(response.statusCode).to.equal(400);
        });

        it("Debería devolver un status 404 si el usuario no se encuentra", async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await requester.delete(`/api/users/${nonExistentId}`);
            expect(response.statusCode).to.equal(404);
        });
    });
});
