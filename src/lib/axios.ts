import Axios from "axios";
import config from "../../config";

export const api = Axios.create({
  baseURL: `http://${config.IP}:5500`
});