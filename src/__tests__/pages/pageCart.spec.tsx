import { render, fireEvent } from '@testing-library/react';

import { useCart } from '../../hooks/useCart';
import Cart from '../../pages/Cart';

const mockedRemoveProduct = jest.fn();
const mockedUpdateProductAmount = jest.fn();
const mockedUseCartHook = useCart as jest.Mock;

jest.mock('../../hooks/useCart');

describe('Testes na pagina Cart', () => {
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
          {
            id: 3,
            amount: 1,
            image:
              "https://img.drogaraia.com.br/catalog/product/e/s/escova-dental-colgate-whitening-com-2-unidades-1.jpg?width=520&height=520&quality=50&type=resize",
            price: 23.55,
            title: "Escova de dente perfeita",
          },
      ],
      removeProduct: mockedRemoveProduct,
      updateProductAmount: mockedUpdateProductAmount,
    });
  });

  it('Teste para aumentar/diminuir uma quantidade de produto', () => {
    const { getAllByTestId, rerender } = render(<Cart />);

    const [incrementFirst] = getAllByTestId('increment-product');
    const [, decrementSecond] = getAllByTestId('decrement-product');
    const [firstProductAmount, secondProductAmount] = getAllByTestId(
      'product-amount'
    );

    expect(firstProductAmount).toHaveDisplayValue('22');
    expect(secondProductAmount).toHaveDisplayValue('44');

    fireEvent.click(incrementFirst);
    fireEvent.click(decrementSecond);

    expect(mockedUpdateProductAmount).toHaveBeenCalledWith({
      amount: 23,
      productId: 1,
    });
    expect(mockedUpdateProductAmount).toHaveBeenCalledWith({
      amount: 43,
      productId: 2,
    });

    mockedUseCartHook.mockReturnValueOnce({
      cart: [
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
            amount: 43,
            image:
              "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcS7xhvzwYuN6MHS5cvjPus-IYDlNe1eRpatiyB_zqjvEye22XA2vTagDsY8w7b9LskMSLNJL9EwWzGK3x80MCmTTLwde0ClZy33_Hpivqo&usqp=CAE",
            price: 23.55,
            title: "Batom nude cobertura total",
          },
      ],
    });

    rerender(<Cart />);
    expect(firstProductAmount).toHaveDisplayValue('23');
    expect(secondProductAmount).toHaveDisplayValue('43');
  });

  it('Teste para não ser capaz de diminuir uma quantidade de produto quando o valor é 1', () => {
    const { getAllByTestId } = render(<Cart />);

    const [decrementFirst] = getAllByTestId('decrement-product');
    const [, , thirdProductAmount] = getAllByTestId('product-amount');

    expect(thirdProductAmount).toHaveDisplayValue('1');

    fireEvent.click(decrementFirst);

    expect(decrementFirst).toHaveProperty('disabled');
    
  });

  it('Teste de remoção de produto', () => {
    const { getAllByTestId, rerender } = render(<Cart />);

    const [removeFirst] = getAllByTestId('remove-product');
    const [firstProduct, secondProduct] = getAllByTestId('product');

    expect(firstProduct).toBeInTheDocument();
    expect(secondProduct).toBeInTheDocument();

    fireEvent.click(removeFirst);

    expect(mockedRemoveProduct).toHaveBeenCalledWith(1);

    mockedUseCartHook.mockReturnValueOnce({
      cart: [
        {
          id: 2,
          amount: 43,
          image:
            "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcS7xhvzwYuN6MHS5cvjPus-IYDlNe1eRpatiyB_zqjvEye22XA2vTagDsY8w7b9LskMSLNJL9EwWzGK3x80MCmTTLwde0ClZy33_Hpivqo&usqp=CAE",
          price: 23.55,
          title: "Batom nude cobertura total",
        },
      ],
    });

    rerender(<Cart />);

    expect(firstProduct).not.toBeInTheDocument();
    expect(secondProduct).toBeInTheDocument();
  });
});
