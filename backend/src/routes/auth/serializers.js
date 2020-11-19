export function serializeUserAuth(user, token) {
  return {
    user: serializeUser(user),
    token,
  };
}

export function serializeUser(user) {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    id: user.id,
    email: user.email,
  };
}
