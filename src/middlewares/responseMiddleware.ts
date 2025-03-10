import {Utils, wrap} from "@mikro-orm/core";

const responseMiddleware = ({set, response}: any) => {
  set.status = 200;
  //return response2 directly cause [object Object] when response2 refers to an object of mikro-orm entity
  return Utils.isEntity(response) ? wrap(response).toObject() : response;
}
export default responseMiddleware;