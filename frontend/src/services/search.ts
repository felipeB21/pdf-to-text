import { type ApiSearchResponse, type Data } from "../types";

export const searchData = async (search: string): Promise<[Error?, Data?]> => {
  try {
    const res = await fetch(
      `https://pdf-to-text-frontend.vercel.app/api/pdf?q=${search}`
    );

    if (!res.ok) return [new Error(`Error searching data: ${res.statusText}`)];
    const json = (await res.json()) as ApiSearchResponse;

    return [undefined, json.data];
  } catch (error) {
    if (error instanceof Error) return [error];
  }

  return [new Error("Error searching data")];
};
