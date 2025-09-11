import { describe, it, after } from "mocha";
import supertest from "supertest";
import { expect } from "chai";
import { connDB } from '../src/config/db.js';
import { config } from '../src/config/config.js';
import mongoose from "mongoose";

const requester = supertest(`http://localhost:${config.GENERAL.PORT ?? 3000}`);

// Conectar a MongoDB con el nombre de la base de datos
await connDB(config.DATABASE.MONGO_URL, config.DATABASE.DB_NAME);

describe("Prueba router pets", function () {
    this.timeout(10_000);

    let petId;

    /**
     * * Por logica, se  especifico que las especies que se puede elegir son:
     * * ['perro', 'gato', 'conejo', 'hamster', 'pez', 'ave', 'reptil', 'otro']
     * * para el test se debe elegir una de estas, para posteriormente eliminar aquellas de esta especie
     */

    after(async () => {
        if (petId) {
            await mongoose.connection.collection("pets").deleteOne({ _id: new mongoose.Types.ObjectId(petId) });
        }
        await mongoose.connection.collection("pets").deleteMany({ specie: "otro" });
    });

    describe("GET /api/pets", () => {
        it("Debería devolver un status 200 y un objeto con un array de mascotas", async () => {
            const response = await requester.get("/api/pets");
            expect(response.statusCode).to.equal(200);
            expect(response.body).to.be.an("object");
            expect(response.body.payload).to.be.an("array");
        });
    });

    describe("POST /api/pets", () => {
        it("Si envio los datos completos de una mascota a /api/pets con POST, deberia devolver un status 201 y una mascota con su id", async () => {
            const mock = {
                name: "Test Pet",
                specie: "otro",
                birthDate: new Date(2023, 1, 1).toUTCString()
            };
            const response = await requester.post("/api/pets").send(mock);
            expect(response.statusCode).to.equal(201);
            expect(response.body.payload).to.have.property("id");
            petId = response.body.payload.id;
        });

        it("Debería devolver un status 400 si faltan campos requeridos", async () => {
            const mock = {
                name: "Test Pet"
            };
            const response = await requester.post("/api/pets").send(mock);
            expect(response.statusCode).to.equal(400);
        });

        it("Debería devolver un status 400 si la especie es inválida", async () => {
            const mock = {
                name: "Test Pet",
                specie: "invalidSpecie",
                birthDate: new Date(2023, 1, 1).toUTCString()
            };
            const response = await requester.post("/api/pets").send(mock);
            expect(response.statusCode).to.equal(400);
        });

        it("Debería devolver un status 400 si la fecha de nacimiento es inválida", async () => {
            const mock = {
                name: "Test Pet",
                specie: "otro",
                birthDate: "invalidDate"
            };
            const response = await requester.post("/api/pets").send(mock);
            expect(response.statusCode).to.equal(400);
        });
    });

    describe("PUT /api/pets/:pid", () => {
        it("Debería actualizar una mascota y devolver un status 200", async () => {
            const updateMock = {
                name: "Test Pet Updated"
            };
            const response = await requester.put(`/api/pets/${petId}`).send(updateMock);            
            expect(response.statusCode).to.equal(200);
            expect(response.body.payload.name).to.equal("Test Pet Updated");
        });

        it("Debería devolver un status 400 si el id es inválido", async () => {
            const response = await requester.put("/api/pets/invalidId").send({ name: "test" });
            expect(response.statusCode).to.equal(400);
        });

        it("Debería devolver un status 404 si la mascota no se encuentra", async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await requester.put(`/api/pets/${nonExistentId}`).send({ name: "test" });
            expect(response.statusCode).to.equal(404);
        });
    });

    describe("DELETE /api/pets/:pid", () => {
        it("Debería eliminar una mascota y devolver un status 200", async () => {
            const response = await requester.delete(`/api/pets/${petId}`);
            expect(response.statusCode).to.equal(200);
        });

        it("Debería devolver un status 400 si el id es inválido", async () => {
            const response = await requester.delete("/api/pets/invalidId");
            expect(response.statusCode).to.equal(400);
        });

        it("Debería devolver un status 404 si la mascota no se encuentra", async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await requester.delete(`/api/pets/${nonExistentId}`);
            expect(response.statusCode).to.equal(404);
        });
    });
});
