import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  fetchProducts,
  fetchProductByHandle,
  createShopifyCart,
  addLineToShopifyCart,
  updateShopifyCartLine,
  removeLineFromShopifyCart,
  fetchCart,
} from "./shopify.server";

export const getProducts = createServerFn({ method: "GET" })
  .validator((data) =>
    z
      .object({
        first: z.number().default(20),
        query: z.string().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    return fetchProducts(data.first, data.query);
  });

export const getProductByHandle = createServerFn({ method: "GET" })
  .validator((data) => z.object({ handle: z.string() }).parse(data))
  .handler(async ({ data }) => {
    return fetchProductByHandle(data.handle);
  });

export const createCart = createServerFn({ method: "POST" })
  .validator((data) =>
    z
      .object({
        quantity: z.number(),
        variantId: z.string(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    return createShopifyCart(data);
  });

export const addCartLine = createServerFn({ method: "POST" })
  .validator((data) =>
    z
      .object({
        cartId: z.string(),
        quantity: z.number(),
        variantId: z.string(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    return addLineToShopifyCart(data.cartId, {
      quantity: data.quantity,
      variantId: data.variantId,
    });
  });

export const updateCartLine = createServerFn({ method: "POST" })
  .validator((data) =>
    z
      .object({
        cartId: z.string(),
        lineId: z.string(),
        quantity: z.number(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    return updateShopifyCartLine(data.cartId, data.lineId, data.quantity);
  });

export const removeCartLine = createServerFn({ method: "POST" })
  .validator((data) =>
    z
      .object({
        cartId: z.string(),
        lineId: z.string(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    return removeLineFromShopifyCart(data.cartId, data.lineId);
  });

export const getCart = createServerFn({ method: "GET" })
  .validator((data) => z.object({ cartId: z.string() }).parse(data))
  .handler(async ({ data }) => {
    return fetchCart(data.cartId);
  });
