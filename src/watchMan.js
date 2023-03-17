import fs from "fs";
import execa from "execa";
import { log, createLoading } from "./utils";
import config from "../config";

export function watchMan() {
  const commands = [
    "../bin/watch",
  ];
  const result = await execa(...commands);
	log(result)
}
