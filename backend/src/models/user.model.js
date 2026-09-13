import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: [true, "Name already exists"],
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    unique: [true, "Account Already exists for this Email"],
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
})

const userModel = mongoose.model("users", userSchema)

export default userModel