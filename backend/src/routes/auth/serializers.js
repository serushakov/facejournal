export function serializeUserAuth(user, token) {
  return {
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      id: user.id,
      email: user.email,
    },
    token,
  };
}
