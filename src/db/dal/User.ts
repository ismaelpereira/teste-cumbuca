import User, { UserInput, UserOutput } from "../model/User";

export const createUser = async (payload: UserInput): Promise<UserOutput> => {
  const user = await User.create(payload);
  return user;
};

export const findUserById = async (id: string): Promise<UserOutput> => {
  const user = await User.findByPk(id);

  if (user === null) {
    throw new Error("User not found");
  }

  return user;
};

export const getAllUsers = async (): Promise<UserOutput[]> => {
  return User.findAll();
};

export const updateUser = async (
  id: string,
  payload: Partial<UserInput>
): Promise<UserOutput> => {
  const user = await User.findByPk(id);

  if (user === null) {
    throw new Error("User not found");
  }

  const updatedUser = await (user as User).update(payload);
  return updatedUser;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const deletedUser = await User.destroy({
    where: { id },
  });
  return !!deletedUser;
};
