import AxiosMock from "axios-mock-adapter";

import { act, renderHook } from "@testing-library/react-hooks";

import { useCart, CartProvider } from "../../hooks/useCart";

import { api } from "../../services/api";

/* constantes necessárias para os testes */
const setItemLocalStorage = jest.spyOn(Storage.prototype, "setItem");
const apiMock = new AxiosMock(api);
const currentDataLocalStoraged = [
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
    amount: 40,
    image:
      "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcS7xhvzwYuN6MHS5cvjPus-IYDlNe1eRpatiyB_zqjvEye22XA2vTagDsY8w7b9LskMSLNJL9EwWzGK3x80MCmTTLwde0ClZy33_Hpivqo&usqp=CAE",
    price: 23.55,
    title: "Batom nude cobertura total",
  },
];

/* TESTES */
describe("Hook useCard", () => {
  beforeEach(() => {
    apiMock.reset();
    jest
      .spyOn(Storage.prototype, "getItem")
      .mockReturnValueOnce(JSON.stringify(currentDataLocalStoraged));
  });

  it("Teste para inicializar o carrinho com o valor localStorage", () => {
    const { result } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    expect(result.current.cart).toEqual(
      expect.arrayContaining([
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
          amount: 40,
          image:
            "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcS7xhvzwYuN6MHS5cvjPus-IYDlNe1eRpatiyB_zqjvEye22XA2vTagDsY8w7b9LskMSLNJL9EwWzGK3x80MCmTTLwde0ClZy33_Hpivqo&usqp=CAE",
          price: 23.55,
          title: "Batom nude cobertura total",
        },
      ])
    );
  });

  it("Teste para adicionar um novo produto", async () => {
    const idProduct = 3;

    apiMock.onGet(`stock/${idProduct}`).reply(200, {
      id: 3,
      amount: 2,
    });
    apiMock.onGet(`products/${idProduct}`).reply(200, {
      id: 3,
      title: "Relogio Smartwatch D20 Feminino Rose iPhone",
      price: 56,
      image: "https://m.media-amazon.com/images/I/51kPx8Ou-4L._AC_SX385_.jpg",
    });

    const { result, waitForNextUpdate } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addProduct(idProduct);
    });

    await waitForNextUpdate({ timeout: 200 });

    expect(result.current.cart).toEqual(
      expect.arrayContaining([
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
          amount: 40,
          image:
            "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcS7xhvzwYuN6MHS5cvjPus-IYDlNe1eRpatiyB_zqjvEye22XA2vTagDsY8w7b9LskMSLNJL9EwWzGK3x80MCmTTLwde0ClZy33_Hpivqo&usqp=CAE",
          price: 23.55,
          title: "Batom nude cobertura total",
        },
        {
          id: 3,
          amount: 1,
          title: "Relogio Smartwatch D20 Feminino Rose iPhone",
          price: 56,
          image:
            "https://m.media-amazon.com/images/I/51kPx8Ou-4L._AC_SX385_.jpg",
        },
      ])
    );
    expect(setItemLocalStorage).toHaveBeenCalledWith(
      "@SiteCompras:cart",
      JSON.stringify(result.current.cart)
    );
  });

  it("Aumentar a quantidade de um produto quando adicionar um produto que já existe no carrinho", async () => {
    const productId = 1;

    apiMock.onGet(`stock/${productId}`).reply(200, {
      id: 1,
      amount: 23,
    });
    apiMock.onGet(`products/${productId}`).reply(200, {
      id: 1,
      image:
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRx_7PC-kVaK0xOeqC969UaI39qcfpAJxVz6Csnh4S-28nr4yY17hBls8IF2e7GYvNFL4ckRgwFzEL7Idxlm-HV6yP7I1u4oxKUy6IafWdo&usqp=CAE",
      price: 44.55,
      title: "Batom Matte - Descontraída - Dailus, Nude, Descontraida",
    });

    const { result, waitForNextUpdate } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addProduct(productId);
    });

    await waitForNextUpdate({ timeout: 200 });

    expect(result.current.cart).toEqual(
      expect.arrayContaining([
        {
          id: 1,
          amount: 23,
          image:
            "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRx_7PC-kVaK0xOeqC969UaI39qcfpAJxVz6Csnh4S-28nr4yY17hBls8IF2e7GYvNFL4ckRgwFzEL7Idxlm-HV6yP7I1u4oxKUy6IafWdo&usqp=CAE",
          price: 44.55,
          title: "Batom Matte - Descontraída - Dailus, Nude, Descontraida",
        },
        {
          id: 2,
          amount: 40,
          image:
            "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcS7xhvzwYuN6MHS5cvjPus-IYDlNe1eRpatiyB_zqjvEye22XA2vTagDsY8w7b9LskMSLNJL9EwWzGK3x80MCmTTLwde0ClZy33_Hpivqo&usqp=CAE",
          price: 23.55,
          title: "Batom nude cobertura total",
        },
      ])
    );
    expect(setItemLocalStorage).toHaveBeenCalledWith(
      "@SiteCompras:cart",
      JSON.stringify(result.current.cart)
    );
  });
});
