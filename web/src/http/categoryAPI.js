import { $host } from ".";
import { CATEGORIES_ROUTE } from "../utils/consts";

export const getCategories = async () => {
    const { data } = await $host.get(CATEGORIES_ROUTE);
    return data;
}