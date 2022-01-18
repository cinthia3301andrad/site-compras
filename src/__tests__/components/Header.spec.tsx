
import { ReactNode } from 'react';
import { render } from '@testing-library/react';
import Header from '../../components/Header';

jest.mock('react-router-dom', () => {
    return {
      Link: ({ children }: { children: ReactNode }) => children,
    };
  });
  
/* aqui faço a simulação do hook useCart que compartilha o estado cart entre as funções, adicionando dois produtos a ele */
jest.mock('../../hooks/useCart', () => {
  return {
    useCart: () => ({
      cart: [
        {
          amount: 2,
          id: 1,
          image:
            'https://static.netshoes.com.br/produtos/tenis-de-caminhada-leve-confortavel/06/E74-0492-006/E74-0492-006_zoom1.jpg',
          price: 133,
          title: 'Tênis de Caminhada',
        },
        {
          amount: 1,
          id: 2,
          image:
            'https://static.netshoes.com.br/produtos/tenis-de-caminhada-leve-confortavel/06/E74-0492-006/E74-0492-006_zoom1.jpg',
          price: 139.9,
          title: 'Tênis Masculino',
        },
      ],
    }),
  };
});

describe('Header Component', () => {
  it('deve ser capaz de processar a quantidade de produtos adicionados ao carrinho', () => {
    const { getByTestId } = render(<Header />);

    const cartSize = getByTestId('cart-size');
    expect(cartSize).toHaveTextContent('2 itens');
  });
});
