import { z } from "zod";

export function isZodSchema(toCheckObj: any): toCheckObj is z.Schema {
  return typeof toCheckObj?.safeParse === "function";
}
