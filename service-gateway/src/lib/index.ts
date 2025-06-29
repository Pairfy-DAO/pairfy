export function getContractPrice(
  discount: boolean,
  discountedPrice: number,
  originalPrice: number,
  orderUnits: number,
  assetPrice: number,
  assetName: string
) {
  try {
    const ADAUSDT = (price: number, assetPrice: number) =>
      convertUSDToLovelace(price, assetPrice);

    const handlers: any = {
      ADAUSDT,
    };

    if (discount) {
      const totalPrice = discountedPrice * orderUnits;

      return handlers[assetName](totalPrice, assetPrice);
    } else {
      const totalPrice = originalPrice * orderUnits;

      return handlers[assetName](totalPrice, assetPrice);
    }
  } catch (err) {
    throw err;
  }
}

/**
 * Converts USD to Lovelace.
 * @param {number} usdAmount - The amount in USD to convert.
 * @param {number} adaPrice - The price of 1 ADA in USD.
 * @returns {number} The converted Lovelace amount as a number.
 */
export function convertUSDToLovelace(
  usdAmount: number,
  adaPrice: number
): number {
  if (usdAmount < 0) {
    throw new Error("USD amount cannot be negative.");
  }

  if (adaPrice <= 0) {
    throw new Error("ADA price must be greater than 0.");
  }

  const amountInADA = usdAmount / adaPrice;

  const amountInLovelace = amountInADA * 1_000_000;

  return Math.round(amountInLovelace);
}

export function getContractFee(contractPrice: number, feePercent: number) {
  try {
    if (feePercent < 1) {
      throw new Error("getContractFee value error");
    }

    const result = (contractPrice * feePercent) / 100;

    return Math.round(result);
  } catch (err) {
    throw err;
  }
}
