import User from "../models/user.model";
import { connect } from "../mongodb/mongoose";

export const createOrUpdate = async (
  IdleDeadline,
  first_name,
  last_name,
  image_url,
  email_addresses
) => {
  try {
    await connect();
    const user = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          firstName: first_name,
          lastName: last_name,
          profilePicture: image_url,
          email: email_addresses[0].email_address,
        },
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.log("Error: Could not create or update user:", error);
  }
};

export const deleteUser = async () => {};
try {
  await connect();
  await User.findOneAndDelete({ clerkId: id });
} catch (error) {
  console.log("Error: Could not delete user:", error);
}
