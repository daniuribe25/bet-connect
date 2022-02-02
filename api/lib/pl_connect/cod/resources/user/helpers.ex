defmodule PlConnect.Cod.User.Helpers do
  def valid_password?(%PlConnect.Cod.User{password_hash: hashed_password}, password)
      when is_binary(hashed_password) and byte_size(password) > 0 do
    Argon2.verify_pass(password, hashed_password)
  end

  def valid_password?(_, _) do
    Argon2.no_user_verify()

    false
  end
end
