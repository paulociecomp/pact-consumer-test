import { Pact } from "@pact-foundation/pact";
import path from "path";
const axios = require("axios").default;

const MOCK_SERVER_PORT = 8080;
const EXPECTED_BODY = [
  {
    place: "Ponta Tempestade",
    house: "Baratheon",
  },
  {
    place: "Rochedo Casterly",
    house: "Lannister",
  },
  {
    place: "Atalaia da água cinzenta",
    house: "Reed",
  },
  {
    place: "Pedra do Dragão",
    house: "Baratheon",
  },
];

describe("Pact consumer", () => {
  const provider = new Pact({
    consumer: "WesterosConsumer",
    provider: "WesterosProvider",
    port: MOCK_SERVER_PORT,
  });

  beforeAll(() => provider.setup());
  // afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  test("display a list fo westeros places", async () => {
    await provider.addInteraction({
      state: "list of places",
      uponReceiving: "a request for places",
      withRequest: {
        method: "GET",
        path: "/westeros",
      },
      willRespondWith: {
        status: 200,
        body: EXPECTED_BODY,
      },
    });

    const response = await axios.get(
      `${provider.mockService.baseUrl}/westeros`
    );
    expect(response.status).toBe(200);
  });
});
