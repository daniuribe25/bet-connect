defmodule PlConnect.Cod.Sessions do
  @moduledoc """
  Session related functions
  """

  # provisional, user secrets later on!
  @secret "jy5l6uo3gCrhJY99MS5A7A39+zECyCBgjoq99jzjqlHug2v1ziHJUqJ63T+gt2v/"

  @salt "plconnect auth"

  @month_in_seconds 60 * 60 * 24 * 30

  @max_age @month_in_seconds * 2

  def generate_token(user_id) do
    Phoenix.Token.sign(@secret, @salt, user_id)
  end

  def retrive_token_data(token) do
    Phoenix.Token.verify(@secret, @salt, token, max_age: @max_age)
  end
end
