import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem("@SiteCompras:cart");
    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const newProductsInCard = [...cart];
      const productIsExistInCart = newProductsInCard.find(
        (product) => product.id === productId
      );

      const {
        data: { amount },
      } = await api.get(`/stock/${productId}`);
      const currentAmountProduct = productIsExistInCart
        ? productIsExistInCart.amount
        : 0;
      const currentAmount = currentAmountProduct + 1;
      if (currentAmount > amount) {
        toast.error("Quantidade solicitada fora de estoque");
        return;
      }

      if (productIsExistInCart) {
        productIsExistInCart.amount = currentAmount;
      } else {
        const { data } = await api.get(`/products/${productId}`);
        const newProduct = { ...data, amount: 1 };
        newProductsInCard.push(newProduct);
      }
      setCart(newProductsInCard);
      localStorage.setItem(
        "@SiteCompras:cart",
        JSON.stringify(newProductsInCard)
      );
    } catch {
      toast.error("Erro na adição do produto");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const newProductsUpdated = [...cart];
      const indexProductCart = cart.findIndex((product) => {
        return product.id === productId;
      });
      if (indexProductCart >= 0) {
        newProductsUpdated.splice(indexProductCart, 1);
        setCart(newProductsUpdated);
        localStorage.setItem(
          "@SiteCompras:cart",
          JSON.stringify(newProductsUpdated)
        );
      } else {
        toast.error("Erro na remoção do produto");
        return;
      }
    } catch {
      toast.error("Erro na remoção do produto");
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if (amount <= 0) return;

      const { data } = await api.get(`/stock/${productId}`);
      const amountStock = data.amount;
      if (amountStock < amount) {
        toast.error("Quantidade solicitada fora de estoque");
        return;
      }

      const newProductsInCard = [...cart];
      const productIsExistInCart = newProductsInCard.find(
        (product) => product.id === productId
      );
      if (productIsExistInCart) {
        productIsExistInCart.amount = amount;
        setCart(newProductsInCard);
        localStorage.setItem(
          "@SiteCompras:cart",
          JSON.stringify(newProductsInCard)
        );
      } else {
        toast.error("Ops! Houve um erro na alteração de quantidade do produto");
        return;
      }
    } catch {
      toast.error("Ops! Houve um erro na alteração de quantidade do produto");
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
