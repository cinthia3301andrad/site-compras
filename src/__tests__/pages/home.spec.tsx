import AxiosMock from "axios-mock-adapter";

import Home from "../../pages/Home";
import { useCart } from "../../hooks/useCart";

import { waitFor, render } from "@testing-library/react";
import { api } from "../../services/api";

const apiMock = new AxiosMock(api);
const mockedAddProduct = jest.fn();
const mockedUseCartHook = useCart as jest.Mock;

jest.mock("../../hooks/useCart");

describe("Testes da página Home", () => {
  beforeAll(() => {
    apiMock.onGet("products").reply(200, [
      {
        id: 1,
        image:
          "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRx_7PC-kVaK0xOeqC969UaI39qcfpAJxVz6Csnh4S-28nr4yY17hBls8IF2e7GYvNFL4ckRgwFzEL7Idxlm-HV6yP7I1u4oxKUy6IafWdo&usqp=CAE",
        price: 44.55,
        title: "Batom Matte - Descontraída - Dailus, Nude, Descontraida",
      },
      {
        id: 2,
        image:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcS7xhvzwYuN6MHS5cvjPus-IYDlNe1eRpatiyB_zqjvEye22XA2vTagDsY8w7b9LskMSLNJL9EwWzGK3x80MCmTTLwde0ClZy33_Hpivqo&usqp=CAE",
        price: 23.55,
        title: "Batom nude cobertura total",
      },
      {
        id: 3,
        image:
          "https://img.drogaraia.com.br/catalog/product/e/s/escova-dental-colgate-whitening-com-2-unidades-1.jpg?width=520&height=520&quality=50&type=resize",
        price: 23.55,
        title: "Escova de dente perfeita",
      },
    ]);
  });

  beforeEach(() => {
    mockedUseCartHook.mockReturnValue({
      cart: [
        {
            id: 1,
            amount: 22,
            image:
              "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRx_7PC-kVaK0xOeqC969UaI39qcfpAJxVz6Csnh4S-28nr4yY17hBls8IF2e7GYvNFL4ckRgwFzEL7Idxlm-HV6yP7I1u4oxKUy6IafWdo&usqp=CAE",
            price: 44.55,
            title: "Batom Matte - Descontraída - Dailus, Nude, Descontraida",
          },
          {
            id: 2,
            amount: 44,
            image:
              "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcS7xhvzwYuN6MHS5cvjPus-IYDlNe1eRpatiyB_zqjvEye22XA2vTagDsY8w7b9LskMSLNJL9EwWzGK3x80MCmTTLwde0ClZy33_Hpivqo&usqp=CAE",
            price: 23.55,
            title: "Batom nude cobertura total",
          },
      ],
      addProduct: mockedAddProduct,
    });
  });

  it("Teste para renderizar cada quantidade de produto adicionada ao carrinho", async () => {
    const { getAllByTestId } = render(<Home />);

    await waitFor(() => getAllByTestId("cart-product-quantity"), {
      timeout: 200,
    });

    const [
      firstProductCartQuantity,
      secondProductCartQuantity,
      thirdProductCartQuantity,
    ] = getAllByTestId("cart-product-quantity");

    expect(firstProductCartQuantity).toHaveTextContent("22");
    expect(secondProductCartQuantity).toHaveTextContent("44");
    expect(thirdProductCartQuantity).toHaveTextContent("0");
  });
});
