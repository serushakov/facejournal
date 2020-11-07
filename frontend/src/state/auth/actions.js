export function setLogin(login) {
  return {
    type: "auth/SET_LOGIN",
    payload: login,
  };
}
